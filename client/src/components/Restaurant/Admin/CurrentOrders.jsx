import { Box, Grid,Heading,TableContainer,Table,TableCaption,Thead,Tr,Th,Tbody,Td,Button,useDisclosure,VStack,Select,Text} from '@chakra-ui/react'
import {useState,useEffect} from 'react'
import cursor from "../../../assets/cursor red.png"
import Sidebar from './Sidebar'
import Footer from '../../Layout/Footer'
import { useGetCurrentOrdersQuery,useUpdateOrderStatusMutation } from '../../../redux/api'

const CurrentOrders = () => {
  const [curr,setCurr]=useState([]);

  const {data:currData,isLoading:currLoading}=useGetCurrentOrdersQuery("");
  console.log("curr",currData);

      useEffect(()=>{
      if(!currLoading && currData){
       setCurr(currData);
      }
    },[currLoading,currData])


  return (
    <>
    <Grid css={{
        cursor:`url(${cursor}),default`
    }} minH={'100vh'} templateColumns={['1fr','5fr 1fr']}>
      <Box
      p={["0","8"]} overflowX={"auto"} 
      >
      <Heading textTransform={'uppercase'} children="Current Orders" my={"2"} textAlign={["center","left"]}/>
      <TableContainer w={["100vw","full"]} boxShadow={'-1px 0 10px rgba(255,0,0,0.5)'} borderRadius={"lg"} borderColor="rgba(255,0,0,0.7)"  p={5} mt={8}>
        <Table variant={"simple"} size={"lg"}>
          <TableCaption>See your pending orders</TableCaption>
          <Thead>
            <Tr>
            <Th fontSize={"md"}>Order Id</Th>
              <Th fontSize={"md"}>Items</Th>
              <Th isNumeric fontSize={"md"}>Price</Th>
              <Th isNumeric fontSize={"md"}>total price</Th>
              <Th fontSize={"md"}>payment method</Th>
              <Th  fontSize={"md"}>date</Th>
              <Th isNumeric fontSize={"md"}>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
          {
            curr.map(c=>(
              <Row  key={c._id} c={c}/>
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

function Row({c}){
  const [status, setStatus] = useState(c.status||"Pending");
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (newStatus) => {
    try {
    console.log(newStatus);
    await updateOrderStatus({orderId:c._id, newStatus});
    setStatus(newStatus);
    } catch (error) {
      console.log(error);
    }
    
  };

  return(
    <Tr>
      <Td fontWeight={"bold"}>#{c._id}</Td>
      <Td fontWeight={"bold"}>
        <VStack>
          {
            c.items.map(item=>(
              <Text color={item.foodType==="veg"?"green":"red"}>{item.foodName} x {item.quantity}</Text>
            ))
          }
        </VStack>
      </Td>
      <Td isNumeric fontWeight={"bold"}>
      <VStack>
          {
            c.items.map(item=>(
              <Text>₹{item.price}</Text>
            ))
          }
        </VStack>
      </Td>
      <Td fontWeight={"bold"}>₹{c.rPrice}</Td>
      <Td fontWeight={"bold"}>{c.paymentMode}</Td>
      <Td fontWeight={"bold"}>{c.createdAt}</Td>
      <Td isNumeric>
       <Select variant={"outline"}  width={"120px"} focusBorderColor='rgba(255,0,0,0.6)' defaultValue={status} onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isLoading}
          >
       <option >Pending</option>
       <option >Preparing</option>
       <option >Delivered</option>
       </Select>
      </Td>
    </Tr>
  )
  }

  
export default CurrentOrders;
