import { Box, Flex,Heading,useMediaQuery,Text} from '@chakra-ui/react'
import React from 'react'
import bg from "../../assets/backgroundImages/homepage.jpeg"
import Navbar from '../Layout/Navbar'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import {Link} from "react-router-dom"
import Footer from '../Layout/Footer';
import ProductCard from '../UI/ProductCard';
import chinese from "../../assets/categories/chinese.jpg"
import beverages from "../../assets/categories/beverages.jpg"
import dessert from "../../assets/categories/dessert.jpg"
import fastfood from "../../assets/categories/fast food.jpg"
import north from "../../assets/categories/north indian.jpg"
import south from "../../assets/categories/south indian.jpg"
import { useGetSearchFoodsQuery } from '../../redux/api';

const Home = () => {
  SwiperCore.use([Navigation]);
  const [isLargerThan768]=useMediaQuery("(min-width:768px)")
  const {isLoading,isError,isSuccess,data,error} = useGetSearchFoodsQuery("");
  console.log(isLoading,isError,isSuccess,data,error);

  const categories=[{
      name:"Chinese",
      pic:chinese
    },
    {
      name:"Beverages",
      pic:beverages
    },
    {
      name:"Dessert",
      pic:dessert
    },
    {
      name:"South Indian",
      pic:south
    },
    {
      name:"Fast Food",
      pic:fastfood
    },
    {
      name:"North Indian",
      pic:north
    }
  ]

  const products=[{
    _id:1,
    image:"https://media.istockphoto.com/id/1309352410/photo/cheeseburger-with-tomato-and-lettuce-on-wooden-board.jpg?s=612x612&w=0&k=20&c=lfsA0dHDMQdam2M1yvva0_RXfjAyp4gyLtx4YUJmXgg=",
    name:"burger",
    type:"non-veg",
    description:"very tasty burger",
    price:"100",
    restaurant:"Tirath",
    rating:4.5,
  },{
    _id:2,
    image:"https://media.istockphoto.com/id/1309352410/photo/cheeseburger-with-tomato-and-lettuce-on-wooden-board.jpg?s=612x612&w=0&k=20&c=lfsA0dHDMQdam2M1yvva0_RXfjAyp4gyLtx4YUJmXgg=",
    name:"burger",
    type:"veg",
    description:"very tasty burger",
    price:"100",
    restaurant:"Tirath",
    rating:3,
  },
  {
    _id:3,
    image:"https://media.istockphoto.com/id/1309352410/photo/cheeseburger-with-tomato-and-lettuce-on-wooden-board.jpg?s=612x612&w=0&k=20&c=lfsA0dHDMQdam2M1yvva0_RXfjAyp4gyLtx4YUJmXgg=",
    name:"burger",
    type:"veg",
    description:"very tasty burger",
    price:"100",
    restaurant:"Tirath",
    rating:2,
  },
  {
    _id:4,
    image:"https://media.istockphoto.com/id/1309352410/photo/cheeseburger-with-tomato-and-lettuce-on-wooden-board.jpg?s=612x612&w=0&k=20&c=lfsA0dHDMQdam2M1yvva0_RXfjAyp4gyLtx4YUJmXgg=",
    name:"burger",
    type:"veg",
    description:"very tasty burger",
    price:"100",
    restaurant:"Tirath",
    rating:1.5,
  },
  {
    _id:5,
    image:"https://media.istockphoto.com/id/1309352410/photo/cheeseburger-with-tomato-and-lettuce-on-wooden-board.jpg?s=612x612&w=0&k=20&c=lfsA0dHDMQdam2M1yvva0_RXfjAyp4gyLtx4YUJmXgg=",
    name:"burger",
    type:"veg",
    description:"very tasty burger",
    price:"100",
    restaurant:"Tirath",
    rating:3,
  },
  {
    _id:6,
    image:"https://media.istockphoto.com/id/1309352410/photo/cheeseburger-with-tomato-and-lettuce-on-wooden-board.jpg?s=612x612&w=0&k=20&c=lfsA0dHDMQdam2M1yvva0_RXfjAyp4gyLtx4YUJmXgg=",
    name:"burger",
    type:"veg",
    description:"very tasty burger",
    price:"100",
    restaurant:"Tirath",
    rating:5,
  }]

  
  const restaurants=[{
    _id:1,
    name:"Tirath Raj",
   profilePic:"https://elchico.in/wp-content/uploads/2022/02/rooftoprest.jpg"
  },{
    _id:2,
    name:"Cafe 96",
    profilePic:"https://t4.ftcdn.net/jpg/02/94/26/33/360_F_294263329_1IgvqNgDbhmQNgDxkhlW433uOFuIDar4.jpg"
  },{
    _id:3,
    name:"Pillai Canteen",
    profilePic:"https://assets.architecturaldigest.in/photos/6385cf3311f0276636badfb6/16:9/w_2560%2Cc_limit/DSC_8367-Edit-W.png"
  },{
    _id:4,
    name:"Mr. Dewsis",
    profilePic:"https://assets.architecturaldigest.in/photos/6385ce336313e32601f141a1/master/w_1600%2Cc_limit/DSC_8597-EDIT%2520-A.jpg"
  }]

  return (
    <Box 
    backgroundImage={bg} 
    >
      <Navbar/>
      <Flex justifyContent="center" width="100%" bg={"transparent"} p={5} >
      <Box width="60%">
        <Swiper navigation>
          {restaurants &&
            restaurants.length > 0 &&
            restaurants.map((restaurant, index) => (
              <SwiperSlide key={index}>
                <div
                  style={{
                    background: `url(${restaurant.profilePic}) center no-repeat`,
                    backgroundSize: 'cover',
                    height: "400px",
                    borderRadius: "20px",
                    opacity:"90%"
                  }}
                >
                  <Flex justifyContent="center" backgroundColor="rgba(0,0,0,0.7)" p={2}  borderRadius={"20px"}>
                  <Link to={`/restaurant/${restaurant._id}`}>
                  <Heading children={restaurant.name} color={"white"}/>
                  </Link>
                  </Flex>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </Box>
    </Flex>
   <Box bg={"transparent"} mt={"4"} padding={3} mb={"2"}>
   <Box bgColor={"rgba(255,255,255,0.9)"} maxWidth={"360px"} rounded={"lg"} p={2}>
    <Heading children="Craving something?" color={"black"}/>
    </Box>
    <Flex flexWrap="wrap" mt={"8px"} gap={5} marginTop={5} >
        { categories && categories.slice(0, isLargerThan768 ? 6 : 2).map((item,index) => (
          
          <CategoryCard key={index} item={item}/>
          
        ))}
      </Flex>
   </Box>
   <Box bg={"transparent"} mt={"4"} padding={3} mb={"2"}>
   <Box bgColor={"rgba(255,255,255,0.9)"} maxWidth={"265px"} rounded={"lg"} p={2}>
    <Heading children="Our Hot Picks!" color={"black"}/>
    </Box>
    <Flex flexWrap="wrap" mt={"8px"} gap={5} marginTop={5}>
        { products && products.slice(0, isLargerThan768 ? 6 : 2).map(product => (
          <Link to={`/food/${product._id}`}>
          <ProductCard key={product.id} product={product}/>
          </Link>
        ))}
      </Flex>
   </Box>

    <Footer/>
    </Box>
  )
}

export default Home;

function CategoryCard({item}){
  return(
    <Link to={`/search?category=${item.name}`}>
    <Box width="225px" 
    height={"155px"} 
    borderWidth="1px" 
    borderRadius="lg" 
    backgroundImage={item.pic} 
    backgroundPosition={"center"} 
    backgroundSize={"cover"}
    display="flex"
  alignItems="center"
  justifyContent="center"
    >
     <Heading children={item.name} size={"md"} color="rgba(255,255,255,0.9)"/>
     </Box>
     </Link>
  )
}

