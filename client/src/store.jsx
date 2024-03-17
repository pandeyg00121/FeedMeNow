import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { authUserApi } from './redux/features/slices/authUserApi';
import authUserReducer from './redux/features/slices/authUserSlice';

import { authRestaurantApi } from './redux/features/slices/authRestaurantApi';
import { myApi } from './redux/api';
import authRestaurantReducer from './redux/features/slices/authRestaurantSlice';
export const store = configureStore({
  reducer: {
    [authUserApi.reducerPath]: authUserApi.reducer,
    [authRestaurantApi.reducerPath]: authRestaurantApi.reducer,
    authuser: authUserReducer,
    authrestaurant: authRestaurantReducer,
    [myApi.reducerPath]: myApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(authUserApi.middleware)
      .concat(myApi.middleware)
      .concat(authRestaurantApi.middleware),

  devTools: true,
});

setupListeners(store.dispatch);

export default store;
