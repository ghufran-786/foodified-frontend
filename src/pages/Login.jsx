import React, { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdFastfood } from "react-icons/md";
import { MdEmail, MdLock } from "react-icons/md";
import { dataContext } from "../UserContext";
import { setCart } from "../redux/cartSlice";

const Login = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const { setIsAuthenticated, setUserName, setUserEmail } = useContext(dataContext);
  const location = useLocation();
  const signupMessage = location.state && location.state.signupMessage;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful - store JWT token securely
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email
        }));
        
        setIsAuthenticated(true);
        setUserName(data.user.name);
        setUserEmail(data.user.email);

        // Fetch user's cart
        try {
          const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
          const cartResponse = await fetch(`${API_URL}/api/cart/`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${data.token}`,
              "Content-Type": "application/json",
            },
          });

          if (cartResponse.ok) {
            const cartData = await cartResponse.json();
            dispatch(setCart({ items: cartData.items || [] }));
          }
        } catch (err) {
          console.error("Error fetching cart:", err);
        }

        navigation("/");
      } else {
        // Login failed
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6" style={{backgroundColor: 'var(--bg-warm)'}}>
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center rounded-full shadow-lg" style={{backgroundColor: 'var(--coral-primary)'}}>
            <MdFastfood className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8" style={{boxShadow: '0 10px 40px rgba(255, 90, 95, 0.15)'}}>
          <h1 className="text-4xl font-bold text-center mb-2" style={{color: 'var(--text-dark)'}}>Welcome Back</h1>
          <p className="text-center mb-8 text-sm sm:text-base" style={{color: 'var(--text-light)'}}>Login to your account</p>

          {/* Signup success message */}
          {signupMessage && (
            <div className="mb-4 p-4 rounded-lg" style={{backgroundColor: '#e6ffed', border: '1px solid #3bb87f'}}>
              <p style={{color: '#175a2f'}} className="font-semibold text-sm">{signupMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg border-2" style={{backgroundColor: '#ffebee', borderColor: '#d32f2f'}}>
              <p style={{color: '#d32f2f'}} className="font-semibold text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{color: 'var(--coral-primary)'}} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className="block w-full pl-12 mb-3 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-dark)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--coral-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 90, 95, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{color: 'var(--coral-primary)'}} />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                className="block w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-dark)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--coral-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 90, 95, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-bold rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:translate-y-0"
              style={{
                backgroundColor: 'var(--coral-primary)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--coral-light)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--coral-primary)';
                }
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1" style={{borderTop: `2px solid var(--border-light)`}}></div>
            <span className="px-3 text-sm" style={{color: 'var(--text-light)'}}>OR</span>
            <div className="flex-1" style={{borderTop: `2px solid var(--border-light)`}}></div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-center mb-4">
            <Link 
              to="/forgot-password" 
              className="text-sm font-semibold transition"
              style={{color: 'var(--coral-primary)'}}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Signup Link */}
          <p className="text-center" style={{color: 'var(--text-dark)'}}>
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold transition" style={{color: 'var(--coral-primary)'}}>
              Signup here
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm mt-6" style={{color: 'var(--text-light)'}}>
          Enjoy delicious food delivered to your door
        </p>
      </div>
    </div>
  );
};

export default Login;
