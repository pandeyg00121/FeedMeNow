import { Box, Grid,Heading,TableContainer,Table,TableCaption,Thead,Tr,Th,Tbody,Td,Image,HStack,Button,useDisclosure,Modal,ModalOverlay,ModalHeader,ModalContent,ModalCloseButton,ModalBody,FormControl,FormLabel,Input} from '@chakra-ui/react'
import {RiDeleteBin7Fill,RiAddCircleFill} from "react-icons/ri"
import {Link} from "react-router-dom";
import {useState,useEffect} from 'react'
import cursor from "../../../assets/cursor red.png"
import Sidebar from './Sidebar'
import Footer from '../../Layout/Footer'
import { useGetAllMenuItemsQuery,useUpdateItemMutation,useDeleteItemMutation } from '../../../redux/api';

const fileUploadCss={
  cursor:"pointer",
  marginLeft:"-5%",
  width:"110%",
  border:'none',
  height:'100%',
  color:'#ECC94B',
  backgroundColor:'teal'
}


const ManageItems = () => {
    
    const { isOpen, onClose, onOpen } = useDisclosure();
    const {isLoading,data:itemData}=useGetAllMenuItemsQuery("")
    console.log(isLoading,itemData);

      const [items,setItems]=useState([]);
      const [selectedItem, setSelectedItem] = useState(null);
      const [deleteItemMutation]=useDeleteItemMutation();
      useEffect(() => {
        if (!isLoading && itemData) {
            setItems(itemData);
        }
    }, [isLoading, itemData]);
      
      
      const deleteItem = async (id) => {
        try {
          await deleteItemMutation(id);
          const updatedItems = items.filter((item) => item._id !== id);
        setItems(updatedItems);
        } catch (error) {
          console.log(error);
        }
        };

      const handleEdit = (item) => {
        setSelectedItem(item);
        onOpen();
      };

      const handleSubmit = (updatedItem) => {
        onClose();
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
              <Row  key={item._id} item={item} deleteItem={deleteItem} handleEdit={handleEdit}/>
            ))
           }
          </Tbody>
        </Table>
      </TableContainer>
      </Box>
      <Sidebar/>
    </Grid>
    <Footer/>
    <EditItemModal isOpen={isOpen} onClose={onClose} item={selectedItem} handleSubmit={handleSubmit} />
    </>
  )
}

function Row({item,deleteItem,handleEdit}){
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
          <Button  variant={"outline"} color={"green.500"} onClick={() => handleEdit(item)}>Edit Item</Button>
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

function EditItemModal({ isOpen, onClose, item, handleSubmit }) {
  const [updatedItem, setUpdatedItem] = useState(item || {});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(item?.image || '');
  const [updateItem, { isLoading }] = useUpdateItemMutation(); // Mutation hook

  useEffect(() => {
    setUpdatedItem(item || {});
    setImagePreview(item?.image || '');
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedItem({ ...updatedItem, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFormSubmit = async () => {
    try {
      const updatedFields = { ...updatedItem };
      if (selectedImage) {
        // If a new image is selected, add it to the updated fields
        updatedFields.image = selectedImage;
      }


      // Call the mutation hook to update the item
      const response = await updateItem({ id: updatedItem._id, ...updatedFields });
      if (response) {
        handleSubmit(updatedFields);
        onClose();
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Item Name</FormLabel>
            <Input name="name" value={updatedItem.name} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Item Type</FormLabel>
            <Input name="type" value={updatedItem.type} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Item Price</FormLabel>
            <Input name="price" value={updatedItem.price} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Item Image</FormLabel>
            <Input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
            />
            {imagePreview && <Image src={imagePreview} alt="Item Preview" maxH={100} mt={2} />}
          </FormControl>
          <Button mt={4} colorScheme="teal" onClick={handleFormSubmit} isLoading={isLoading}>
            Save Changes
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ManageItems;


