import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, increaseQuantity, decreaseQuantity, setCart } from "./redux/cartSlice";
import { dataContext } from "./UserContext";
import { cartAPI } from "./services/cartAPI";

const CartItems = () => {
  let items = useSelector((state) => state.cart.itemsList);
  let dispatch = useDispatch();
  const navigate = useNavigate();
  const { userEmail, setShowCart } = useContext(dataContext);
  let totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleDelete = async (item) => {
    dispatch(removeItem(item));
    
    // Remove from database if user is authenticated
    if (userEmail) {
      const cartData = await cartAPI.removeItem(item.id);
      if (cartData) dispatch(setCart({ items: cartData.items }));
    }
  };

  const handleIncrease = async (item) => {
    dispatch(increaseQuantity(item));
    
    // Update in database if user is authenticated
    if (userEmail) {
      const cartData = await cartAPI.increaseQuantity(item.id);
      if (cartData) dispatch(setCart({ items: cartData.items }));
    }
  };

  const handleDecrease = async (item) => {
    dispatch(decreaseQuantity(item));
    
    // Update in database if user is authenticated
    if (userEmail) {
      const cartData = await cartAPI.decreaseQuantity(item.id);
      if (cartData) dispatch(setCart({ items: cartData.items }));
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg flex flex-col gap-3 p-4 max-h-[70vh] overflow-y-auto">
      {items.length === 0 ? (
        <div className="text-center py-8" style={{color: 'var(--text-light)'}}>No items in cart</div>
      ) : (
        <>
          {items.map((item, index) => (
          <div key={index} className="w-full p-2 shadow-md flex flex-col md:flex-row justify-between gap-5 rounded-lg transition-all duration-300" style={{backgroundColor: 'var(--bg-warm)', border: '1px solid var(--border-light)'}}>
            <div className="w-full md:w-[60%] bg-white flex flex-col md:flex-row gap-5 rounded-lg overflow-hidden">
              <div className="w-full md:w-[40%] h-44 md:h-auto overflow-hidden rounded-lg">
                <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
              </div>
              <div className="w-full md:w-[60%] flex flex-col gap-3 py-2">
                <div className="text-lg font-semibold" style={{color: 'var(--text-dark)'}}>{item.name}</div>
                <div className="text-sm" style={{color: 'var(--text-light)'}}>{item.type}</div>
                <div className="w-full max-w-[240px] h-10 flex rounded-lg overflow-hidden shadow-md font-semibold border-2" style={{borderColor: 'var(--coral-primary)'}}>
                  <button
                    onClick={() => handleDecrease(item)}
                    className="w-1/3 h-full flex justify-center items-center font-bold text-xl bg-white transition-all duration-300 ease-in-out hover:scale-110"
                    style={{color: 'var(--coral-primary)'}}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--coral-primary)';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = 'var(--coral-primary)';
                    }}
                  >
                    −
                  </button>

                  <span className="w-2/5 h-full flex justify-center items-center" style={{backgroundColor: 'var(--border-light)', color: 'var(--coral-primary)'}}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(item)}
                    className="w-1/3 h-full flex justify-center items-center font-bold text-xl bg-white transition-all duration-300 ease-in-out hover:scale-110"
                    style={{color: 'var(--coral-primary)'}}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--coral-primary)';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = 'var(--coral-primary)';
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-4 md:gap-6">
              <span className="text-xl font-semibold" style={{color: 'var(--coral-primary)'}}>Rs. {item.price * item.quantity}/-</span>
              <RiDeleteBin6Line 
                onClick={() => handleDelete(item)}
                className="w-7 h-7 cursor-pointer transition-all duration-300 hover:scale-110" 
                style={{color: '#d32f2f'}}
              />
            </div>
          </div>
        ))}
          <div className="border-t-2 pt-4 mt-4" style={{borderColor: 'var(--border-light)'}}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold" style={{color: 'var(--text-dark)'}}>Subtotal:</span>
              <span className="text-lg font-semibold" style={{color: 'var(--text-dark)'}}>Rs. {totalPrice}/-</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold" style={{color: 'var(--text-dark)'}}>GST (5%):</span>
              <span className="text-lg font-semibold" style={{color: 'var(--coral-primary)'}}>Rs. {(totalPrice * 0.05).toFixed(2)}/-</span>
            </div>
            <div className="flex justify-between items-center border-t-2 pt-3" style={{borderColor: 'var(--border-light)'}}>
              <span className="text-lg font-semibold" style={{color: 'var(--text-dark)'}}>Total Price:</span>
              <span className="text-2xl font-bold" style={{color: 'var(--coral-primary)'}}>Rs. {(totalPrice + totalPrice * 0.05).toFixed(2)}/-</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowCart(false);
                navigate("/payment");
              }}
              className="mt-4 w-full py-3 rounded-xl font-semibold text-white transition-all duration-200"
              style={{ backgroundColor: '#EF4444' }}
            >
              Proceed to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartItems;
