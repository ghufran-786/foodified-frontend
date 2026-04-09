import {configureStore} from '@reduxjs/toolkit';
import cartSlice from './cartSlice';

export const store = configureStore({
        reducer: {
                cart: cartSlice,
        },
});

// Persist cart to localStorage per-user whenever store updates
const saveCartToLocalStorage = () => {
    try {
        const state = store.getState();
        const authData = localStorage.getItem('authData');
        if (!authData) return;
        const { userName } = JSON.parse(authData);
        if (!userName) return;
        const key = `cart_${userName}`;
        localStorage.setItem(key, JSON.stringify({ itemsList: state.cart.itemsList }));
    } catch (error) {
        console.error('Failed to persist cart to localStorage:', error);
    }
};

store.subscribe(saveCartToLocalStorage);