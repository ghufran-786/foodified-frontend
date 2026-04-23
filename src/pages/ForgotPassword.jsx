import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdFastfood, MdEmail } from "react-icons/md";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://foodified-backend.onrender.com";
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setEmail("");
        // Optionally redirect after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Error sending reset email");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-200 via-lime-100 to-yellow-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-green-500 flex items-center justify-center rounded-full shadow-lg">
            <MdFastfood className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Forgot Password?</h1>
          <p className="text-center text-gray-500 mb-8">
            Enter your email to receive a password reset link
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <p className="text-green-600 font-semibold text-sm">{success}</p>
              <p className="text-green-500 text-xs mt-2">
                {success.includes("generated") 
                  ? "Check browser console for reset link (DEMO MODE)" 
                  : "Redirecting to login..."}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <p className="text-red-600 font-semibold text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <div className="flex items-center">
                {/*<MdEmail className="absolute left-3 text-green-500 w-5 h-5" />*/}
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:translate-y-0"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t-2 border-gray-200"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t-2 border-gray-200"></div>
          </div>

          {/* Back to Login */}
          <p className="text-center text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="text-green-500 font-bold hover:text-green-600 transition">
              Back to Login
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Check your email for reset instructions
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
