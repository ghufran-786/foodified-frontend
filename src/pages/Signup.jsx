import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdFastfood } from "react-icons/md";
import { MdPerson, MdEmail, MdLock } from "react-icons/md";
import { dataContext } from "../UserContext";

const Signup = () => {
  const navigation = useNavigate();
  const { setIsAuthenticated, setUserName } = useContext(dataContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Password validation function
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const isValid = minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

    setPasswordStrength({
      isValid,
      hasMinLength: minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    });

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    // Clear general error when user starts typing
    setError("");

    // Validate password on change
    if (name === "password") {
      const isValidPassword = validatePassword(value);

      if (value && !isValidPassword) {
        setPasswordError("Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character");
      } else if (value && isValidPassword) {
        setPasswordError(""); // Clear error for valid password
      } else {
        setPasswordError(""); // Clear error when field is empty
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    // Validate password strength
    if (!validatePassword(form.password)) {
      setPasswordError("Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character");
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://foodified-backend.onrender.com";
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // Signup successful - redirect user to login page (do not auto-login)
        navigation("/login", { state: { signupMessage: "Account created successfully. Please login." } });
      } else {
        // Signup failed
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error("Signup error:", err);
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
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8" style={{boxShadow: '0 10px 40px rgba(255, 90, 95, 0.15)'}}>
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2" style={{color: 'var(--text-dark)'}}>Join Us</h1>
          <p className="text-center mb-8 text-sm sm:text-base" style={{color: 'var(--text-light)'}}>Create your account to get started</p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg border-2" style={{backgroundColor: '#ffebee', borderColor: '#d32f2f'}}>
              <p style={{color: '#d32f2f'}} className="font-semibold text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Input */}
            <div className="relative">
              <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{color: 'var(--coral-primary)'}} />
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
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
                className="block w-full pl-12 pr-4 mb-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                className="block w-full pl-12 pr-4 py-3 mb-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{
                  borderColor: passwordError ? '#d32f2f' : 'var(--border-light)',
                  color: 'var(--text-dark)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = passwordError ? '#d32f2f' : 'var(--coral-primary)';
                  e.target.style.boxShadow = passwordError
                    ? '0 0 0 3px rgba(211, 47, 47, 0.1)'
                    : '0 0 0 3px rgba(255, 90, 95, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = passwordError ? '#d32f2f' : 'var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {/* Password Error Message */}
              {passwordError && (
                <div className="ml-7 mt-1">
                  <p style={{color: '#d32f2f'}} className="text-sm font-medium">{passwordError}</p>
                </div>
              )}
              {/* Password Strength Indicator (Optional) */}
              {form.password && passwordStrength.isValid && (
                <div className="ml-7 mt-1">
                  <p style={{color: '#4caf50'}} className="text-sm font-medium">✓ Strong password</p>
                </div>
              )}
            </div>

            {/* Signup Button */}
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
              {loading ? "Creating account..." : "Signup"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1" style={{borderTop: `2px solid var(--border-light)`}}></div>
            <span className="px-3 text-sm" style={{color: 'var(--text-light)'}}>OR</span>
            <div className="flex-1" style={{borderTop: `2px solid var(--border-light)`}}></div>
          </div>

          {/* Login Link */}
          <p className="text-center" style={{color: 'var(--text-dark)'}}>
            Already have an account?{" "}
            <Link to="/login" className="font-bold transition" style={{color: 'var(--coral-primary)'}}>
              Login here
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm mt-6" style={{color: 'var(--text-light)'}}>
          Fast, fresh food delivery at your fingertips
        </p>
      </div>
    </div>
  );
};

export default Signup;
