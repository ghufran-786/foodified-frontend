import React, { useState, useRef, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cartSlice";
import { dataContext } from "../UserContext";
import { MdChat, MdClose, MdSend } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from "axios";
import { cartAPI } from "../services/cartAPI";

// SVG Fallback image - no network required
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e0e0e0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3E🍽️%3C/text%3E%3Ctext x='50%25' y='70%25' font-size='12' fill='%23999' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

// Helper function to get valid image URL
const getImageUrl = (image) => {
  if (!image) return FALLBACK_IMAGE;
  
  // Block placeholder URLs that fail to load
  if (image.includes("via.placeholder.com")) {
    return FALLBACK_IMAGE;
  }
  
  return image;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "👋 Hey! I'm your Food Assistant. Tell me what you're craving - like 'breakfast under 100' or 'veg pizza' - and I'll show you amazing options!",
      timestamp: new Date(),
      products: []
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { userEmail, isAuthenticated } = useContext(dataContext);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add message to chat
  const addMessage = (text, type, products = []) => {
    const newMessage = {
      id: messages.length + 1,
      type,
      text,
      timestamp: new Date(),
      products
    };
    setMessages([...messages, newMessage]);
  };

  // Fallback image - SVG data URI (no network calls)
  const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e0e0e0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3E🍽️%3C/text%3E%3Ctext x='50%25' y='70%25' font-size='12' fill='%23999' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

  // Handle Add to Cart
  const handleAddToCart = async (product) => {
    try {
      // DEBUG: Log product object before adding to cart
      console.log("🖼️ Adding to cart - Full product object:", product);
      console.log("📸 Product image field:", product.image);
      
      // Ensure image field exists
      const productToAdd = {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || FALLBACK_IMAGE,
        type: product.type
      };
      
      console.log("✅ Final product to dispatch:", productToAdd);
      
      // Add to Redux state (for instant UI update)
      dispatch(addItem(productToAdd));
      
      // IMPORTANT: Also save to backend to persist cart across sessions
      if (isAuthenticated) {
        const backendPayload = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image || FALLBACK_IMAGE
        };
        const backendResponse = await cartAPI.addItem(backendPayload);
        console.log("💾 Backend cart response:", backendResponse);
      }
      
      // Show success message
      addMessage(`✅ Added "${product.name}" to your cart!`, "bot");
    } catch (error) {
      console.error("Error adding to cart:", error);
      addMessage("Sorry, couldn't add to cart. Please try again.", "bot");
    }
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    addMessage(inputValue, "user");
    const query = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Call backend chat API
      const response = await axios.post(`${API_URL}/api/chat`, {
        userMessage: query
      });

      const { reply, products } = response.data;
      
      // DEBUG: Log response from backend
      console.log("🤖 Bot response:", response.data);
      console.log("📦 Products received from backend:", products);
      
      // DEBUG: Check each product for image field
      if (products && products.length > 0) {
        products.forEach((p, idx) => {
          console.log(`Product ${idx + 1}:`, {
            name: p.name,
            price: p.price,
            hasImage: !!p.image,
            imageValue: p.image,
            imageLength: p.image ? p.image.length : 0
          });
        });
      }
      
      // Ensure all products have image field with fallback
      const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e0e0e0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3E🍽️%3C/text%3E%3Ctext x='50%25' y='70%25' font-size='12' fill='%23999' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
      const productsWithImages = (products || []).map(p => ({
        ...p,
        image: p.image || FALLBACK_IMAGE
      }));
      
      console.log("✨ Products after image fallback:", productsWithImages);

      // Add bot reply with products
      addMessage(reply, "bot", productsWithImages);

    } catch (error) {
      console.error("Chat error:", error);
      addMessage(
        "Sorry, I couldn't process that. Please try again!",
        "bot"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isAuthenticated && userEmail ? (
        <>
          {/* Floating Chat Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-2xl text-white transition-all duration-300 hover:scale-110 z-40"
            style={{
              backgroundColor: "var(--coral-primary)",
            }}
            title={isOpen ? "Close chat" : "Open chat"}
          >
            {isOpen ? <MdClose /> : <MdChat />}
          </button>

          {/* Chat Window */}
          {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-96 max-h-[600px] rounded-2xl shadow-2xl flex flex-col bg-white z-50"
          style={{
            boxShadow: "0 10px 40px rgba(255, 90, 95, 0.2)",
          }}
        >
          {/* Header */}
          <div
            className="p-4 rounded-t-2xl text-white flex items-center justify-between"
            style={{
              backgroundColor: "var(--coral-primary)",
            }}
          >
            <div>
              <h3 className="font-bold text-lg">🍽️ Food Assistant</h3>
              <p className="text-xs opacity-90">Suggest items, I'll show you options!</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl hover:opacity-80 transition-opacity"
            >
              <MdClose />
            </button>
          </div>

          {/* Messages Container */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{
              backgroundColor: "var(--bg-warm)",
              maxHeight: "450px"
            }}
          >
            {messages.map((msg) => (
              <div key={msg.id}>
                {/* Message Text */}
                <div
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} mb-2`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.type === "user"
                        ? "text-white rounded-br-none"
                        : "text-gray-800 bg-white rounded-bl-none border border-gray-200"
                    }`}
                    style={
                      msg.type === "user"
                        ? { backgroundColor: "var(--coral-primary)" }
                        : {}
                    }
                  >
                    {msg.text}
                  </div>
                </div>

                {/* Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 mt-3">
                    {msg.products.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex items-start"
                      >
                        {/* Product Image */}
                        <div className="w-32 h-32 flex-shrink-0 bg-gray-100 overflow-hidden relative">
                          {imageLoadingStates[product._id] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                              <AiOutlineLoading3Quarters className="animate-spin text-xl" style={{color: "var(--coral-primary)"}} />
                            </div>
                          )}
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover block"
                            style={{ minWidth: "100%", minHeight: "100%", display: "block" }}
                            onLoadStart={() => {
                              setImageLoadingStates(prev => ({...prev, [product._id]: true}));
                            }}
                            onLoad={(e) => {
                              console.log("✅ Image loaded successfully for:", product.name);
                              setImageLoadingStates(prev => ({...prev, [product._id]: false}));
                            }}
                            onError={(e) => {
                              console.log("❌ Image failed to load for:", product.name);
                              console.log("   Attempted URL:", e.target.src);
                              setImageLoadingStates(prev => ({...prev, [product._id]: false}));
                              e.target.src = FALLBACK_IMAGE;
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">
                              {product.name}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {product.description || "Delicious food item"}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className="font-bold text-lg"
                              style={{ color: "var(--coral-primary)" }}
                            >
                              ₹{product.price}
                            </span>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="px-3 py-1 text-white text-xs font-semibold rounded-lg transition-all hover:opacity-90"
                              style={{
                                backgroundColor: "var(--coral-primary)",
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-lg rounded-bl-none border border-gray-200 flex items-center gap-2">
                  <AiOutlineLoading3Quarters className="text-lg animate-spin" style={{color: "var(--coral-primary)"}} />
                  <span className="text-sm text-gray-600">Finding items for you...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-gray-200 flex gap-2 bg-white rounded-b-2xl"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., breakfast under 100"
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 disabled:opacity-50"
              style={{
                focusRing: "var(--coral-primary)",
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-3 py-2 text-white rounded-lg text-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "var(--coral-primary)",
              }}
            >
              <MdSend />
            </button>
          </form>
        </div>
      )}
    </>
      ) : null}
    </>
  );
};

export default Chatbot;
