import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const myApi=createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({baseUrl:process.env.REACT_APP_BASE_URL}),
    endpoints:(builder)=>({
      //Get requests
      getHomeRestaurants:builder.query({query:()=>"top-5-restaurants"}),
      getHomeFoods:builder.query({query:()=>"top-6-foods"}),
      getAllMenuItems:builder.query({query:()=>"/restaurants/manageItems"}),
      getPreviousOrders:builder.query({query:()=>"/restaurants/manageOrders/previous"}),
      getCurrentOrders:builder.query({query:()=>"/restaurants/manageOrders/current"}),
      getAllUsers:builder.query({query:()=>"/admin/allUsers"}),
      getAllRestaurants:builder.query({query:()=>"/admin/allRes"}),
      getPendingReqAdmin:builder.query({query:()=>"/admin/pendingReq"}),
      getAllReviews:builder.query({query:()=>"/admin/allReviews"}),
      getMyCart:builder.query({query:()=>"/users/cart"}),
      //Post requests
      newFoodItem:builder.mutation({
        query:(food)=>({
          url:"/restaurants/addItem",
          method:"POST",
          body:food,
        })
      }),
      
      
     })
})

export const {useGetHomeFoodsQuery,useGetHomeRestaurantsQuery,useNewFoodItemMutation}=myApi;

