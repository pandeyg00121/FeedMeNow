import { Box } from '@chakra-ui/react'
import React from 'react'
import bg from "../../assets/backgroundImages/homepage.jpeg"
import Navbar from '../Layout/Navbar'

const Home = () => {
  return (
    <Box 
    maxW="100%"
    overflow="hidden"
    bgSize="cover"
    bgPosition="center"
    bgRepeat="no-repeat"
    bgImage={bg}
    height="100vh"
    
    >
      <Navbar/>
    </Box>
  )
}

export default Home
