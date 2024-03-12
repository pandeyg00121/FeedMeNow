import {useState,useEffect} from 'react'
import Navbar from "../Layout/Navbar"
import {Grid,Box,HStack,VStack,Checkbox,Select,Button,Heading,Text} from "@chakra-ui/react"
import {useNavigate,useLocation} from "react-router-dom"
import Footer from '../Layout/Footer'
const Search = () => {
    const navigate=useNavigate();
    const location=useLocation();
    const categories=[
        'Chinese',
        'Beverages',
        'North Indian',
        'Dessert',
        'South Indian',
        'Fast Food' ]
    const [sideBarData,setSideBarData]=useState({
            type:'',
            category:'Chinese',
            sort:'price',
            order:'desc'
    }); 
    useEffect(()=>{

        const urlParams=new URLSearchParams(location.search);
        const typeFromUrl = urlParams.get('type');
        const categoryFromUrl=urlParams.get('category');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');
    
        if (
            typeFromUrl ||
            categoryFromUrl ||
            sortFromUrl ||
            orderFromUrl
          ) {
            setSideBarData({
              type: typeFromUrl || '',
              category: categoryFromUrl ||'',
              sort: sortFromUrl || 'price',
              order: orderFromUrl || 'asc',
            });
        }
    },[location.search]) 

    const handleChange=(e)=>{
        if (
            e.target.id === 'veg' ||
            e.target.id === 'non-veg'
          ) {
            setSideBarData({ ...sideBarData, type: e.target.id });
          }
      
          if (
            e.target.id === 'category' 
          ) {
            setSideBarData({
              ...sideBarData,
              category:e.target.value
            });
          }
      
          if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'price';
      
            const order = e.target.value.split('_')[1] || 'desc';
      
            setSideBarData({ ...sideBarData, sort, order });
          }
    }
    
    const handleSubmit=(e)=>{
        e.preventDefault();
        const urlParams=new URLSearchParams();
        urlParams.set('type', sideBarData.type);
        urlParams.set('category',sideBarData.category);
        urlParams.set('sort', sideBarData.sort);
        urlParams.set('order', sideBarData.order);
        const searchQuery=urlParams.toString();
        navigate(`/search?${searchQuery}`);
       }
  return (
    <>
    <Navbar/>
    <Grid minH={'100vh'} templateColumns={['1fr','5fr 1fr']}>
    <VStack p={"6"} borderRight={"1px solid"} borderBottom={"1px solid"} borderColor="rgba(211,211,211,0.5)">
      <Heading children="Filters" size={"md"} mb={4}/>
      <form onSubmit={handleSubmit}>
      <VStack spacing={8} mt={3} >
      <HStack spacing={5}>
      <Text fontWeight="bold" children="Type:"/>
      <Checkbox colorScheme='green' id='veg' onChange={handleChange} checked={sideBarData.type==='veg'}>Veg</Checkbox>
      <Checkbox colorScheme='red' id='non-veg' onChange={handleChange} checked={sideBarData.type==='non-veg'}>Non-Veg</Checkbox>
      </HStack>
      <HStack spacing={5}>
      <Text fontWeight="bold" children="Category:"/>
      <Select width={"105px"} onChange={handleChange} id='category'>
      {categories.map(item=>(
        <option key={item} value={item}>{item}</option>
       ))}
      </Select>
      </HStack>
      <HStack>
      <Text fontWeight="bold" children="Sort By:"/>
      <Select>
       <option value='price_desc'>Price High to Low</option>
       <option value='price_asc'>Price Low to High</option>
      </Select>
      </HStack>
      </VStack>
      <Button>Apply Filters</Button>
      </form>
      </VStack>
    <Box>
        <Box width={"100%"} p={["4", "6"]} height={"300px"}>
           <HStack>
           </HStack>
        </Box>
    </Box>
    </Grid>
    <Footer/>
    </>
  )
}

export default Search
 
