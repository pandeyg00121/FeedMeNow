import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const myApi=createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({baseUrl:process.env.REACT_APP_BASE_URL}),
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
      getSearchRes:builder.query({query:()=>"/restaurants"}),
      getSearchFoods:builder.query({query:()=>"/foods"}),
      //admin routes
      getAllUsers:builder.query({query:()=>"/admin/allUsers"}),
      getAllRestaurants:builder.query({query:()=>"/admin/allRes"}),
      getPendingReqAdmin:builder.query({query:()=>"/admin/pendingReq"}),
      //cart routes
      getMyCart:builder.query({query:()=>"/users/cart"}),
      //user routes
      getUserReviews:builder.query({query:()=>"/users/myReviews"}),
      getUserPrevOrders:builder.query({query:()=>"/users/prevOrders"}),
      getUserCurrOrders:builder.query({query:()=>"/users/currOrders"}),
    

      //Post requests
      //user routes
      newFoodItem:builder.mutation({
        query:(id)=>({
          url:"/users/placeOrder",
          method:"POST",
          body:id,
        })
      }),
      //restaurant routes
      newFoodItem:builder.mutation({
        query:(food)=>({
          url:"/restaurants/addItem",
          method:"POST",
          body:food,
        })
      }),


      //Patch Requests
      changeOrderStatus:builder.mutation({
        query:({_id,...patch})=>({
          url:"/restaurants/manageOrders/updateOrderStatus",
          method:"PATCH",
          body:patch,
        })
      }),
      
      
      
     })
})

export const {useGetHomeFoodsQuery,useGetHomeRestaurantsQuery,useNewFoodItemMutation,useGetSearchFoodsQuery}=myApi;

