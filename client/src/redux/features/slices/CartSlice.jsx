import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : null,
  },
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      const { foodId, quantity, restaurantId } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.foodId === foodId
      );
      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({ foodId, quantity, restaurantId });
      }
    },
    removeFromCart: (state, action) => {
      const { foodId } = action.payload;
      state.items = state.items.filter(item => item.foodId !== foodId);
    },
    updateQuantity: (state, action) => {
      const { foodId, quantity, restaurantId } = action.payload;
      const itemToUpdate = state.items.find(item => item.foodId === foodId);
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }
    },
    clearCart: state => {
      state.items = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
