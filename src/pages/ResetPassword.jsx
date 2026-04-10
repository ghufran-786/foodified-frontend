import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { MdFastfood, MdLock } from "react-icons/md";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "https://foodified-backend.onrender.com";
        const response = await fetch(
          `${API_URL}/api/verify-reset-token/${token}`
        );
        
        if (response.ok) {
          setIsTokenValid(true);
        } else {
          setError("Reset link is invalid or expired");
          setIsTokenValid(false);
        }
      } catch (err) {
        setError("Error verifying reset link");
        console.error("Token verification error:", err);
      } finally {
        setValidating(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setError("No reset token provided");
      setValidating(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate inputs
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://foodified-backend.onrender.com";
      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setNewPassword("");
        setConfirmPassword("");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Error resetting password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-green-200 via-lime-100 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 flex items-center justify-center rounded-full shadow-lg mx-auto mb-4">
            <MdFastfood className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600 font-semibold">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-green-200 via-lime-100 to-yellow-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-green-500 flex items-center justify-center rounded-full shadow-lg">
              <MdFastfood className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Invalid Link</h1>
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <p className="text-center text-gray-600 mb-6">
              The password reset link is invalid or has expired.
            </p>
            <Link
              to="/forgot-password"
              className="block text-center w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
            >
              Request New Link
            </Link>
            <p className="text-center text-gray-600 mt-4">
              <Link to="/login" className="text-green-500 font-bold hover:text-green-600">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Reset Password</h1>
          <p className="text-center text-gray-500 mb-8">Enter your new password</p>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <p className="text-green-600 font-semibold text-sm">{success}</p>
              <p className="text-green-500 text-xs mt-2">Redirecting to login...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <p className="text-red-600 font-semibold text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Input */}
            <div className="relative">
              <div className="flex items-center">
                <MdLock className="absolute left-3 text-green-500 w-5 h-5" />
                <input
                  type="password"
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="flex items-center">
                <MdLock className="absolute left-3 text-green-500 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:translate-y-0"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-gray-600 mt-6">
            <Link to="/login" className="text-green-500 font-bold hover:text-green-600 transition">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
