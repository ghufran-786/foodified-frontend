import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/payments`
  : "http://localhost:5000/api/payments";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const paymentAPI = {
  // Process simulated payment with multiple methods
  processPayment: async (paymentData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/process`,
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error processing payment:", error?.response?.data || error.message);
      throw new Error(
        error?.response?.data?.message || "Payment processing failed"
      );
    }
  },

  // Legacy methods (kept for compatibility but not used in new implementation)
  createPaymentIntent: async ({ amount, currency }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/create-payment-intent`,
        { amount, currency },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating payment intent:", error?.response?.data || error.message);
      throw new Error(
        error?.response?.data?.message || "Unable to create payment intent"
      );
    }
  },

  recordPayment: async ({ paymentIntentId, amount, currency, status }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/confirm`,
        { paymentIntentId, amount, currency, status },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error recording payment:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Unable to record payment");
    }
  },
};
