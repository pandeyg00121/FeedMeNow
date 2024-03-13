import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const myApi=createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({baseUrl:process.env.REACT_APP_BASE_URL}),
    endpoints:(builder)=>({
      getFoods:builder.query({query:()=>"foods"})
    })
})

export const {useGetFoodsQuery}=myApi;

