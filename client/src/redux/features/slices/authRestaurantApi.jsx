import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authRestaurantApi = createApi({
  reducerPath: 'authRestaurantApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:5500/api' }), // Your API base URL
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/restaurants/login', // Your login endpoint
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/restaurants/logout',
        method: 'POST',
      }),
    }),
    forgotPassword: builder.mutation({
      query: email => ({
        url: '/restaurants/forgotPassword',
        method: 'POST',
        body: { email },
      }),
    }),
    signup: builder.mutation({
      query: data => ({
        url: '/restaurants/signup',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useSignupMutation,
} = authRestaurantApi;
