import React, { useContext } from "react";
import image1 from "../assets/image1.avif";
import { LuLeafyGreen } from "react-icons/lu";
import { GiChickenOven } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/cartSlice";
import { dataContext } from "../UserContext";
import { cartAPI } from "../services/cartAPI";


const FoodCard = ({name, image, id, price, type}) => {
  const dispatch = useDispatch();
  const { userEmail, isAuthenticated } = useContext(dataContext);
  const cartItems = useSelector((state) => state.cart.itemsList);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      return;
    }

    // Check if item already exists in current cart
    const existingItem = cartItems.find(item => item.id === id);
    
    if (existingItem) {
      // Item exists, use increaseQuantity action instead
      console.log("Item exists, incrementing quantity");
    }

    // Add to Redux state (will increment if exists)
    dispatch(addItem({name, image, id, price, type}));

    // Sync to database
    if (userEmail) {
      try {
        const cartData = await cartAPI.addItem({ id, name, price, image });
        if (cartData) {
          console.log("Cart synced with database:", cartData);
        }
      } catch (error) {
        console.error("Error syncing to database:", error);
      }
    }
  };

  return (
    <div className="p-4 w-75 h-100 bg-white rounded-xl flex flex-col gap-3 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-1">
      <div className="w-full h-[60%] overflow-hidden rounded-lg">
        <img src={image} alt="" className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" />
      </div>

      <div className="text-2xl font-semibold text-gray-900">{name}</div>

      <div className="w-full flex justify-between items-center">
        <div className="text-lg font-bold" style={{color: 'var(--coral-primary)'}}>Rs. {price}/-</div>
        <div className="flex justify-between items-center gap-2 text-base font-semibold" style={{color: 'var(--coral-primary)'}}>
          {type==="veg"?<LuLeafyGreen />:<GiChickenOven />}
          <span>{type}</span>
        </div>
      </div>

      <button 
        className="w-full p-3 bg-white rounded-lg text-white font-bold transition-all duration-300 outline-0" 
        style={{
          backgroundColor: 'var(--coral-primary)',
          boxShadow: '0 4px 12px rgba(255, 90, 95, 0.25)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'var(--coral-light)';
          e.target.style.boxShadow = '0 6px 16px rgba(255, 90, 95, 0.35)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'var(--coral-primary)';
          e.target.style.boxShadow = '0 4px 12px rgba(255, 90, 95, 0.25)';
          e.target.style.transform = 'translateY(0)';
        }}
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default FoodCard;


