import { Box, Grid,Heading,TableContainer,Table,TableCaption,Thead,Tr,Th,Tbody,Td,Image,HStack,Button,useDisclosure} from '@chakra-ui/react'
import {RiDeleteBin7Fill,RiAddCircleFill} from "react-icons/ri"
import {Link} from "react-router-dom";
import {useState,useEffect} from 'react'
import cursor from "../../../assets/cursor red.png"
import Sidebar from './Sidebar'
import Footer from '../../Layout/Footer'
import { useGetAllMenuItemsQuery } from '../../../redux/api';


const ManageItems = () => {
    
    const { isOpen, onClose, onOpen } = useDisclosure();
    
    const {isLoading,data:itemData}=useGetAllMenuItemsQuery("")
    console.log(isLoading,itemData);

      const [items,setItems]=useState([]);

      useEffect(() => {
        if (!isLoading && itemData) {
            setItems(itemData);
        }
    }, [isLoading, itemData]);
      
      
      const deleteItem = (id) => {
        const updatedItems = items.filter((item) => item._id !== id);
        setItems(updatedItems);
      };

  return (
    <>
    <Grid css={{
        cursor:`url(${cursor}),default`
    }} minH={'100vh'} templateColumns={['1fr','5fr 1fr']}>
      <Box
      p={["0","8"]} overflowX={"auto"} 
      >
      <HStack>
      <Heading textTransform={'uppercase'} children="All Menu Items" my={"2"} textAlign={["center","left"]}/>
      <LinkButton Icon={RiAddCircleFill} text={"Add New Item"} url="additem" />
      </HStack>
      <TableContainer w={["100vw","full"]} boxShadow={'-1px 0 10px rgba(255,0,0,0.5)'} borderRadius={"lg"} borderColor="rgba(255,0,0,0.7)"  p={5} mt={8}>
        <Table variant={"simple"} size={"lg"}>
          <TableCaption>All available items in the menu</TableCaption>
          <Thead>
            <Tr>
              <Th fontSize={"lg"}>Id</Th>
              <Th fontSize={"lg"}>Image</Th>
              <Th fontSize={"lg"}>name</Th>
              <Th fontSize={"lg"}>Type</Th>
              <Th isNumeric fontSize={"lg"}>Price</Th>
              <Th isNumeric fontSize={"lg"}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
           {
            items.map(item=>(
              <Row  key={item._id} item={item} deleteItem={deleteItem}/>
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

function Row({item,deleteItem}){
    const handleDelete=()=>{
        deleteItem(item._id);
    }
    return(
      <Tr>
        <Td fontWeight={"bold"}>#{item._id}</Td>
        <Td>
        <Image src={item.image} maxHeight={"80px"} maxWidth={"80px"}/>
        </Td>
        <Td fontWeight={"bold"}>{item.name}</Td>
        <Td textTransform={"uppercase"} fontWeight={"bold"} color={item.type==="veg"?"green":"red"}>{item.type}</Td>
        <Td isNumeric fontWeight={"bold"}>₹{item.price}</Td>
        <Td isNumeric>
         <HStack
         justifyContent={"flex-end"}
         >
          <Button  variant={"outline"} color={"green.500"}>Edit Item</Button>
          <Button  color={"red.500"} onClick={handleDelete}>
            <RiDeleteBin7Fill/>
          </Button>
         </HStack>
        </Td>
      </Tr>
    )
  }

  function LinkButton({url,Icon,text,active}){
    return (
        <Link to={`/restaurant/${url}`}>
        <Button fontSize={"larger"} variant={"ghost"} colorScheme={active?'red':''}>
           <Icon style={{margin:'4px'}}/> 
           {text}
        </Button>
      </Link>
    )
}

export default ManageItems;


