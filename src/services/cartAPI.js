const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/cart`
  : "https://foodified-backend.onrender.com/api/cart";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const cartAPI = {
  // Get user's cart (backend expects JWT auth and no email path param)
  getCart: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });
      if (response.ok) return await response.json();
      throw new Error("Failed to fetch cart");
    } catch (error) {
      console.error("Error fetching cart:", error);
      return null;
    }
  },

  // Add item to cart
  addItem: async (item) => {
    try {
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(item),
      });
      if (response.ok) return await response.json();
      throw new Error("Failed to add item");
    } catch (error) {
      console.error("Error adding item:", error);
      return null;
    }
  },

  // Remove item from cart
  removeItem: async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/remove/${itemId}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeader(),
        },
      });
      if (response.ok) return await response.json();
      throw new Error("Failed to remove item");
    } catch (error) {
      console.error("Error removing item:", error);
      return null;
    }
  },

  // Increase item quantity
  increaseQuantity: async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/increase/${itemId}`, {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
        },
      });
      if (response.ok) return await response.json();
      throw new Error("Failed to increase quantity");
    } catch (error) {
      console.error("Error increasing quantity:", error);
      return null;
    }
  },

  // Decrease item quantity
  decreaseQuantity: async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/decrease/${itemId}`, {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
        },
      });
      if (response.ok) return await response.json();
      throw new Error("Failed to decrease quantity");
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      return null;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clear`, {
        method: "DELETE",
        headers: {
          ...getAuthHeader(),
        },
      });
      if (response.ok) return await response.json();
      throw new Error("Failed to clear cart");
    } catch (error) {
      console.error("Error clearing cart:", error);
      return null;
    }
  },
};
