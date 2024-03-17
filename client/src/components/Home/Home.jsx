import { Box, Flex,Heading,useMediaQuery,Text} from '@chakra-ui/react'
import {useState,useEffect} from 'react'
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
import { useGetSearchFoodsQuery, useGetSearchResQuery,useGetHomeRestaurantsQuery,useGetHomeFoodsQuery } from '../../redux/api';

const Home = () => {
  SwiperCore.use([Navigation]);
  const [isLargerThan768]=useMediaQuery("(min-width:768px)")
  //const {isLoading,isError,isSuccess,data,error} = useGetSearchFoodsQuery("");
  const {data:foodsData,isLoading:isLoadingFoods} = useGetHomeFoodsQuery("");
  const {data:resData,isLoading:isLoadingRes}=useGetHomeRestaurantsQuery("");
  console.log(resData);
  const [products,setProducts]=useState([]);
  const [restaurants,setRestaurants]=useState([]);

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
  useEffect(() => {
    if (!isLoadingFoods && foodsData) {
        setProducts(foodsData);
    }
}, [isLoadingFoods, foodsData]);

useEffect(() => {
  if (!isLoadingRes && resData) {
      setRestaurants(resData);
  }
}, [isLoadingRes, resData]);

  

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
                    background: `url(${bg}) center no-repeat`,
                    backgroundSize: 'cover',
                    height: "400px",
                    borderRadius: "20px",
                    opacity:"90%"
                  }}
                >
                  <Flex justifyContent="center" backgroundColor="rgba(0,0,0,0.7)" p={2}  borderRadius={"20px"}>
                  <Link to={`/restaurant/${restaurant.slug}`}>
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
          <Link to={`/food/${product.slug}`}>
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

