import { Box, Grid,Heading,TableContainer,Table,TableCaption,Thead,Tr,Th,Tbody,Td,Button,useDisclosure,VStack,Select,Text} from '@chakra-ui/react'
import {useState,useEffect} from 'react'
import cursor from "../../../assets/cursor red.png"
import Sidebar from './Sidebar'
import Footer from '../../Layout/Footer'
import { useGetPreviousOrdersQuery} from '../../../redux/api'

const PreviousOrders = () => {
  const [prev,setPrev]=useState([]);

  const {data:prevData,isLoading:prevLoading}=useGetPreviousOrdersQuery("");
  console.log("prev",prevData);

  const currentData=[{
    _id:"123457890098",
    items:[{
       foodName:"Burger",
       type:"veg",
       quantity:2,
       price:160,
    },{
      foodName:"Roll",
      type:"non-veg",
      quantity:3,
      price:180,
   },{
    foodName:"Pizza",
    type:"veg",
    quantity:1,
    price:360,
 }],
 totalPrice:700,
 date:"2024-03-13 19:30:07",
 payment:"Online",
 status:"Pending"
  },{
    _id:"123457890098",
    items:[{
       foodName:"Burger",
       type:"veg",
       quantity:2,
       price:160,
    },{
      foodName:"Roll",
      type:"non-veg",
      quantity:3,
      price:180,
   },{
    foodName:"Pizza",
    type:"veg",
    quantity:1,
    price:360,
 }],
 totalPrice:700,
 date:"2024-03-13 19:30:07",
 payment:"Online",
 status:"Preparing"
  },{
    _id:"123457890098",
    items:[{
       foodName:"Burger",
       type:"veg",
       quantity:2,
       price:160,
    },{
      foodName:"Roll",
      type:"non-veg",
      quantity:3,
      price:180,
   },{
    foodName:"Pizza",
    type:"veg",
    quantity:1,
    price:360,
 }],
 totalPrice:700,
 date:"2024-03-13 19:30:07",
 payment:"Online",
 status:"Preparing"
  },{
    _id:"123457890098",
    items:[{
       foodName:"Burger",
       type:"veg",
       quantity:2,
       price:160,
    },{
      foodName:"Roll",
      type:"non-veg",
      quantity:3,
      price:180,
   },{
    foodName:"Pizza",
    type:"veg",
    quantity:1,
    price:360,
 }],
 totalPrice:700,
 date:"2024-03-13 19:30:07",
 payment:"Online",
 status:"Preparing"
  },{
    _id:"123457890098",
    items:[{
       foodName:"Burger",
       type:"veg",
       quantity:2,
       price:160,
    },{
      foodName:"Roll",
      type:"non-veg",
      quantity:3,
      price:180,
   },{
    foodName:"Pizza",
    type:"veg",
    quantity:1,
    price:360,
 }],
 totalPrice:700,
 date:"2024-03-13 19:30:07",
 payment:"Online",
 status:"Pending"
  },{
    _id:"123457890098",
    items:[{
       foodName:"Burger",
       type:"veg",
       quantity:2,
       price:160,
    },{
      foodName:"Roll",
      type:"non-veg",
      quantity:3,
      price:180,
   },{
    foodName:"Pizza",
    type:"veg",
    quantity:1,
    price:360,
 }],
 totalPrice:700,
 date:"2024-03-13 19:30:07",
 payment:"Online",
 status:"Pending"
  },
  ]
      useEffect(()=>{
      if(!prevLoading && prevData){
       setPrev(prevData);
      }
    },[prevLoading,prevData])


  return (
    <>
    <Grid css={{
        cursor:`url(${cursor}),default`
    }} minH={'100vh'} templateColumns={['1fr','5fr 1fr']}>
      <Box
      p={["0","8"]} overflowX={"auto"} 
      >
      <Heading textTransform={'uppercase'} children="Previous Orders" my={"2"} textAlign={["center","left"]}/>
      <TableContainer w={["100vw","full"]} boxShadow={'-1px 0 10px rgba(255,0,0,0.5)'} borderRadius={"lg"} borderColor="rgba(255,0,0,0.7)"  p={5} mt={8}>
        <Table variant={"simple"} size={"lg"}>
          <TableCaption>All available items in the menu</TableCaption>
          <Thead>
            <Tr>
            <Th fontSize={"md"}>Order Id</Th>
              <Th fontSize={"md"}>Items</Th>
              <Th isNumeric fontSize={"md"}>Price</Th>
              <Th isNumeric fontSize={"md"}>total price</Th>
              <Th fontSize={"md"}>payment method</Th>
              <Th  fontSize={"md"}>date</Th>
            </Tr>
          </Thead>
          <Tbody>
          {
            prev.map(s=>(
              <Row  key={s._id} s={s}/>
            ))
           }
          </Tbody>
        </Table>
      </TableContainer>
      </Box>
      <Sidebar/>
    </Grid>
    <Footer/>
    </>
  )
}

function Row({key,s}){
    return(
      <Tr>
        <Td fontWeight={"bold"}>#{s._id}</Td>
        <Td fontWeight={"bold"}>
          <VStack>
            {
              s.items.map(item=>(
                <Text color={item.foodType==="veg"?"green":"red"}>{item.foodName} x {item.quantity}</Text>
              ))
            }
          </VStack>
        </Td>
        <Td isNumeric fontWeight={"bold"}>
        <VStack>
            {
              s.items.map(item=>(
                <Text>₹{item.price}</Text>
              ))
            }
          </VStack>
        </Td>
        <Td fontWeight={"bold"}>₹{s.rPrice}</Td>
        <Td fontWeight={"bold"}>{s.paymentMode}</Td>
        <Td fontWeight={"bold"}>{s.createdAt}</Td>
      </Tr>
    )
  }
  
export default PreviousOrders;
