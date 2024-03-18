import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};
const authUserSlice = createSlice({
  name: 'authuser',
  initialState,
  reducers: {
    setCredentialsuser: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      localStorage.setItem('cartItems',JSON.stringify(action.payload.cart))
    },
    logoutuserdata: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});
export const { setCredentialsuser, logoutuserdata } = authUserSlice.actions;
export default authUserSlice.reducer;
