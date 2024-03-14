import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  restaurantInfo: localStorage.getItem('restaurantInfo')
    ? JSON.parse(localStorage.getItem('restaurantInfo'))
    : null,
};
const authRestaurantSlice = createSlice({
  name: 'authrestaurant',
  initialState,
  reducers: {
    setCredentialsrestaurant: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('restaurantInfo', JSON.stringify(action.payload));
    },
    logoutrestaurantdata: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('restaurantInfo');
    },
  },
});
export const { setCredentialsrestaurant, logoutrestaurantdata } =
  authRestaurantSlice.actions;
export default authRestaurantSlice.reducer;
