import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdFastfood } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { dataContext } from "../UserContext";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { cartAPI } from "../services/cartAPI";

const Nav = ({ input, setInput }) => {
  let {
    showCart,
    setShowCart,
    isAuthenticated,
    setIsAuthenticated,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
  } = useContext(dataContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  let items = useSelector((state) => state.cart.itemsList);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDropdown]);

  const handleLogout = () => {
    // Clear only the Redux state (in-memory)
    // Do NOT clear from database - user's cart should persist
    dispatch(clearCart());
    
    setIsAuthenticated(false);
    setUserName("");
    setUserEmail("");
    setShowDropdown(false);
    // Remove auth tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // authData is removed by UserContext effect when isAuthenticated becomes false
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const NAV_HEIGHT = 80; // px

  return (
    <>
      <div style={{height: NAV_HEIGHT}} aria-hidden="true" />
      <div className="w-full flex justify-between items-center px-8" style={{backgroundColor: '#1F2A44', boxShadow: '0 4px 16px rgba(255, 90, 95, 0.1)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: NAV_HEIGHT}}>
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
        aria-label="Foodified home"
      >
        <div className="w-12.5 h-12.5 flex justify-center items-center rounded-lg" style={{backgroundColor: 'var(--coral-primary)'}}>
          <MdFastfood className="w-7.5 h-7.5 text-white" />
        </div>

        <div style={{color: 'white', fontFamily: 'Poppins, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 700, fontSize: NAV_HEIGHT * 0.25}}>
          foodified
        </div>
      </div>

      <form
        action=""
        className="w-[60%] h-15 bg-white flex items-center px-5 gap-5 rounded-lg"
        style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'}}
        onSubmit={(e) => e.preventDefault()}
      >
        <FaSearch style={{color: 'var(--coral-primary)'}} className="w-5 h-5" />
        <input
          type="text"
          placeholder="search items..."
          className="w-full outline-none text-[16px] md-text-[20px]"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          style={{color: 'var(--text-dark)'}}
        />
      </form>

      {isAuthenticated ? (
        // Authenticated UI with Dropdown
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: 'var(--coral-primary)',
              boxShadow: '0 4px 12px rgba(255, 90, 95, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--coral-light)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 90, 95, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--coral-primary)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 90, 95, 0.2)';
            }}
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span style={{color: 'var(--coral-primary)'}} className="font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span>{userName}</span>
            <MdKeyboardArrowDown
              className={`w-5 h-5 transition-transform duration-300 ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border-2 z-50 animate-in fade-in" style={{borderColor: 'var(--coral-light)'}}>
              <div className="p-4 border-b" style={{borderColor: 'var(--border-light)'}}>
                <p className="font-semibold text-sm" style={{color: 'var(--text-dark)'}}>
                  Logged in as{" "}
                  <span style={{color: 'var(--coral-primary)'}} className="block mt-1">{userName}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 font-semibold transition duration-200 rounded-b-lg hover:bg-red-50"
                style={{color: '#d32f2f'}}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        // Unauthenticated UI
        <button
          className="text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
          style={{
            backgroundColor: 'var(--coral-primary)',
            boxShadow: '0 4px 12px rgba(255, 90, 95, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--coral-light)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--coral-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onClick={() => navigate("/signup")}
        >
          Signup
        </button>
      )}

      <div
        className="w-12.5 h-12.5 flex justify-center items-center rounded-lg relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        style={{backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', cursor: 'pointer'}}
        onClick={() => setShowCart((prev) => !prev)}
      >
        <span className="absolute top-0 right-2 font-bold" style={{color: 'var(--coral-primary)'}}>
          {items.length}
        </span>
        <FaShoppingBag className="w-7.5 h-7.5" style={{color: 'var(--coral-primary)'}} />
      </div>
      </div>
    </>
  );
};

export default Nav;
