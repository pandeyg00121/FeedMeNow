import { setupListeners } from '@reduxjs/toolkit/query/react';
import { configureStore } from '@reduxjs/toolkit';
import { myApi } from './redux/api';
export const store = configureStore({
    reducer: {
      
      [myApi.reducerPath]: myApi.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware()
        .concat(myApi.middleware),
        
  
    devTools: true,
  });
  
  setupListeners(store.dispatch);
  
  export default store;