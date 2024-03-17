import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { getToken } from './authUtils';

const BASE_URL = 'http://127.0.0.1:5500/api';

const baseQueryWithToken = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getToken(); // Get token
    if (token) {
      headers.set('Authorization',`Bearer ${token}`); // Set Authorization header
    }
    return headers;
  },
});

export const myApi=createApi({
    reducerPath:"api",
    baseQuery:baseQueryWithToken,
    endpoints:(builder)=>({
      //Get requests
      //home routes
      getHomeRestaurants:builder.query({query:()=>"top-5-restaurants"}),
      getHomeFoods:builder.query({query:()=>"top-6-foods"}),
      //restaurant routes
      getAllMenuItems:builder.query({query:()=>"/restaurants/manageItems"}),
      getPreviousOrders:builder.query({query:()=>"/restaurants/manageOrders/previous"}),
      getCurrentOrders:builder.query({query:()=>"/restaurants/manageOrders/current"}),
      getAllReviews:builder.query({query:()=>"/restaurants/myReviews"}),
      //search routes
      getSearchRes:builder.query({query:()=>"/restaurantsAll"}),
      getSearchFoods:builder.query({query:()=>"/foodsAll"}),
      //admin routes
      getAllUsers:builder.query({query:()=>"/admin/allUser"}),
      getAllRestaurants:builder.query({query:()=>"/admin/allRes"}),
      getPendingReqAdmin:builder.query({query:()=>"/admin/pendingReq"}),
      //cart routes
      getMyCart:builder.query({query:()=>"/users/cart"}),
      //user routes
      getUserReviews:builder.query({query:()=>"/users/myReviews"}),
      getUserPrevOrders:builder.query({query:()=>"/users/prevOrders"}),
      getUserCurrOrders:builder.query({query:()=>"/users/currOrders"}),
    

      //Post requests
      //restaurant routes
      newFoodItem:builder.mutation({
        query:(food)=>({
          url:"/restaurants/addItem",
          method:"POST",
          body:food,
        })
      }),
      
      updateOrderStatus: builder.mutation({
        query: ({orderId, newStatus}) => ({
          url: `/restaurants/manageOrders/updateOrderStatus/${orderId}`,
          method: 'POST',
          body: { status: newStatus },
        }),
      }),
      //admin routes
      updateUserStatus: builder.mutation({
        query: ({userId, newActive}) => ({
          url: `/admin/allUser/${userId}`,
          method: 'POST',
          body: { active: newActive },
        }),
      }),
      acceptPendingReq: builder.mutation({
        query: (reqId) => ({
          url: `/admin/pendingReq/${reqId}`,
          method: 'POST',
          body: {},
        }),
      }),
     

      //Patch Requests
      updateItem: builder.mutation({
        query: ({id,...updatedFields}) => ({
          url: `/restaurants/manageItems/editItem/${id}`, 
          method: 'PATCH',
          body: updatedFields,
        }),
      }),

     //Delete Requests
     deleteItem: builder.mutation({
      query: (itemId) => ({
        url: `/restaurants/manageItems/deleteItem/${itemId}`,
        method: 'DELETE',
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/allUser/${userId}`,
        method: 'DELETE',
      }),
    }),
    deleteRes: builder.mutation({
      query: (resId) => ({
        url: `/admin/allRes/${resId}`,
        method: 'DELETE',
      }),
    }),
       
      
      
     })
})

export const {useGetHomeFoodsQuery,useGetHomeRestaurantsQuery,useNewFoodItemMutation,useGetSearchFoodsQuery,useGetAllMenuItemsQuery,useUpdateItemMutation,useGetPreviousOrdersQuery,useGetCurrentOrdersQuery,useUpdateOrderStatusMutation,useDeleteItemMutation,useGetAllUsersQuery,useUpdateUserStatusMutation,useDeleteUserMutation,useGetAllRestaurantsQuery,useDeleteResMutation,useGetPendingReqAdminQuery,useAcceptPendingReqMutation}=myApi;

