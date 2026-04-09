import { createSlice } from "@reduxjs/toolkit";

// Helper function to get user email from auth data
const getUserEmail = () => {
    const authData = localStorage.getItem('authData');
    if (authData) {
        try {
            const data = JSON.parse(authData);
            return data.userEmail || null;
        } catch (error) {
            console.error('Failed to parse auth data:', error);
            return null;
        }
    }
    return null;
};

// Load initial state from localStorage as fallback
const loadFromLocalStorage = () => {
    try {
        const authData = localStorage.getItem('authData');
        if (authData) {
            const { userName } = JSON.parse(authData);
            const cartKey = `cart_${userName}`;
            const savedCart = localStorage.getItem(cartKey);
            return savedCart ? JSON.parse(savedCart) : { itemsList: [] };
        }
        return { itemsList: [] };
    } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        return { itemsList: [] };
    }
};

const cartSlice = createSlice({
    name: "cart",
    initialState: loadFromLocalStorage(),
    reducers: {
        addItem: (state, action) => {
            // Check if item already exists in cart
            const existingItem = state.itemsList.find(item => item.id === action.payload.id);
            
            if (existingItem) {
                // Item exists, increment quantity
                existingItem.quantity += 1;
            } else {
                // Item doesn't exist, add it with quantity 1
                const itemWithQuantity = { ...action.payload, quantity: 1 };
                state.itemsList.push(itemWithQuantity);
            }
        },
        removeItem: (state, action) => {
            state.itemsList = state.itemsList.filter(item => item.id !== action.payload.id);
        },
        increaseQuantity: (state, action) => {
            const item = state.itemsList.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity += 1;
            }
        },
        decreaseQuantity: (state, action) => {
            const item = state.itemsList.find(item => item.id === action.payload.id);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },
        clearCart: (state) => {
            state.itemsList = [];
        },
        setCart: (state, action) => {
            // Set cart from database
            state.itemsList = action.payload.items || [];
        }
    }
});

export const { addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
