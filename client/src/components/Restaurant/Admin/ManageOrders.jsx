import { Box, Grid,Heading,TableContainer,Table,TableCaption,Thead,Tr,Th,Tbody,Td,Button,useDisclosure,VStack,Select} from '@chakra-ui/react'
import {useState,useEffect} from 'react'
import cursor from "../../../assets/cursor red.png"
import Sidebar from './Sidebar'
import Footer from '../../Layout/Footer'

const ManageOrders = () => {
    const [current,setCurrent]=useState(false);

    const data=[{
        _id:1,
        name:"Burger",
        type:"non-veg",
        price:"100",
        payment:"Online"
      },{
        _id:2,
        name:"Burger",
        type:"non-veg",
        price:"100",
        payment:"Online"
      },
      {
        _id:3,
        name:"Burger",
        type:"veg",
        price:"100",
        payment:"Online"
      },
      {
        _id:4,
        name:"Burger",
        type:"veg",
        price:"100",
        payment:"Online"
      },
      {
        _id:5,
        name:"Burger",
        type:"veg",
        price:"100",
        payment:"Online"
      },
      {
        _id:6,
        name:"Burger",
        type:"veg",
        price:"100",
        payment:"Online"
      }
    ]

      const [items,setItems]=useState([]);

      useEffect(()=>{
         setItems(data);
      },[data])

      const toggleHandler=()=>{
        setCurrent(!current);
      }

  return (
    <>
    <Grid css={{
        cursor:`url(${cursor}),default`
    }} minH={'100vh'} templateColumns={['1fr','5fr 1fr']}>
      <Box
      p={["0","8"]} overflowX={"auto"} 
      >
      <VStack>
      <Heading textTransform={'uppercase'} children={current?"Current Orders":"Previous Orders"} my={"2"} textAlign={["center","left"]}/>
      <Button bgColor={current?"gray":"green"}  children={current?" View Previous Orders":" View Current Orders"} onClick={toggleHandler}/>
      </VStack>
      {
       current?(
      <TableContainer w={["100vw","full"]} boxShadow={'-1px 0 10px rgba(255,0,0,0.5)'} borderRadius={"lg"} borderColor="rgba(255,0,0,0.7)"  p={5} mt={8}>
        <Table variant={"simple"} size={"lg"}>
          <TableCaption>All available items in the menu</TableCaption>
          <Thead>
            <Tr>
              <Th fontSize={"md"}>Order Id</Th>
              <Th fontSize={"md"}>name</Th>
              <Th fontSize={"md"}>Type</Th>
              <Th fontSize={"md"}>Payment Method</Th>
              <Th isNumeric fontSize={"md"}>Price</Th>
              <Th isNumeric fontSize={"md"}>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
           {
            items.map(item=>(
              <Row  key={item._id} item={item}/>
            ))
           }
          </Tbody>
        </Table>
      </TableContainer>
       ):(
        <TableContainer w={["100vw","full"]} boxShadow={'-1px 0 10px rgba(255,0,0,0.5)'} borderRadius={"lg"} borderColor="rgba(255,0,0,0.7)"  p={5} mt={8}>
        <Table variant={"simple"} size={"lg"}>
          <TableCaption>All available items in the menu</TableCaption>
          <Thead>
            <Tr>
              <Th fontSize={"md"}>Order Id</Th>
              <Th fontSize={"md"}>name</Th>
              <Th fontSize={"md"}>Type</Th>
              <Th fontSize={"md"}>Payment Method</Th>
              <Th isNumeric fontSize={"md"}>Price</Th>
            </Tr>
          </Thead>
          <Tbody>
           {
            items.map(item=>(
              <Row2  key={item._id} item={item}/>
            ))
           }
          </Tbody>
        </Table>
      </TableContainer>
       )
      }
      </Box>
      <Sidebar/>
    </Grid>
    <Footer/>
    </>
  )
}

function Row({key,item}){
    return(
      <Tr>
        <Td fontWeight={"bold"}>#{item._id}</Td>
        <Td fontWeight={"bold"}>{item.name}</Td>
        <Td textTransform={"uppercase"} fontWeight={"bold"} color={item.type==="veg"?"green":"red"}>{item.type}</Td>
        <Td fontWeight={"bold"}>{item.payment}</Td>
        <Td isNumeric fontWeight={"bold"}>₹{item.price}</Td>
        <Td isNumeric>
         <Select variant={"outline"}  width={"120px"} focusBorderColor='rgba(255,0,0,0.6)' >
         <option >Pending</option>
         <option >Preparing</option>
         <option >Delivered</option>
         </Select>
        </Td>
      </Tr>
    )
  }

  function Row2({key,item}){
    return(
      <Tr>
        <Td fontWeight={"bold"}>#{item._id}</Td>
        <Td fontWeight={"bold"}>{item.name}</Td>
        <Td textTransform={"uppercase"} fontWeight={"bold"} color={item.type==="veg"?"green":"red"}>{item.type}</Td>
        <Td fontWeight={"bold"}>{item.payment}</Td>
        <Td isNumeric fontWeight={"bold"}>₹{item.price}</Td>
      </Tr>
    )
  }

export default ManageOrders;
