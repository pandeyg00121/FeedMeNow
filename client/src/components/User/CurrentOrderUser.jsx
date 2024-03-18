import { useState,useEffect } from 'react';
import {
  Box,
  Heading,
  Stack,
  Text,
  Divider,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  HStack,
} from '@chakra-ui/react';
import { useGetUserCurrOrdersQuery } from '../../redux/api';


const CurrentOrdersUser = () => {
  
  const {data,isLoading}=useGetUserCurrOrdersQuery("");
  const [orders,setOrders]=useState([]);

  useEffect(()=>{
    if(!isLoading && data){
      setOrders(data);
    }
  },[isLoading,data])

  console.log(orders);

  return (
    <Box p={4} maxW="90%" mx="auto">
      <Heading mb={4} textAlign="center" color="teal.500">
        Current Orders
      </Heading>
      {orders.map(order => (
        <ListItem order={order}/>
      ))}
    </Box>
  );
};

function ListItem({order}){
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewDetails = order => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return(
  <Box bg="gray.100" p={4} borderRadius="lg" mb={4}>
  <Stack direction="row" align="center" justify="space-between" mb={2}>
    <Text fontWeight="bold" fontSize="lg">
      Order Id: {order._id}
    </Text>
    <Text
      fontWeight="bold"
      color={
        order.status === 'Pending'
          ? 'red.500'
          : 'yellow.500'
      }
    >{order.status}
    </Text>
    </Stack>
  <Text fontWeight={"bold"} color={"teal.600"}>{order.restaurantName}:</Text>
  {order.items.map(item => (
    <Stack
      direction="row"
      align="center"
      mb={2}
    >      <Text fontWeight={"bold"}>{item.foodName}</Text>
      <Text fontWeight="bold">x {item.quantity}</Text>
    </Stack>
  ))}
  <Stack direction="row" justify="space-between" mt={4}>
    <Button colorScheme="blue" onClick={() => handleViewDetails(order)}>
      View Details
    </Button>
  </Stack>
  <Divider />
  <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md" p={4} maxW="800px">
          {' '}
          {/* Adjusted width here */}
          <ModalHeader fontSize="xl" fontWeight="bold" color="teal.500">
            Order Details
          </ModalHeader>
          <ModalCloseButton color="teal.500" />
          <ModalBody>
            {selectedOrder && (
              <Box>
                <Text fontWeight="bold">Order Id: {selectedOrder._id}</Text>
                <Text fontWeight={"bold"}>Date: {selectedOrder.createdAt}</Text>
                <HStack spacing={1}>
                <Text fontWeight={"bold"}>Status:</Text>
                <Text fontWeight="bold" color={selectedOrder.status==="Pending"?"red":"orange"}>{selectedOrder.status}</Text>
                </HStack>
                <Text fontWeight={"bold"}>Payment Method: {selectedOrder.paymentMode}</Text>
                <Text fontWeight="bold" mt={4}>
                  Items:
                </Text>
                {selectedOrder.items.map((item) => (
                  <Box mb={2} mt={2}>
                    <Text>
                      {item.foodName} x {item.quantity}
                    </Text>
                    <Text>Price: ₹{item.price}</Text>
                  </Box>
                ))}
                
                <Divider my={4} />
                <Text fontWeight="bold">Total:</Text>
                <Text>
                ₹ {selectedOrder.rPrice}
                </Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
</Box>
)
}

export default CurrentOrdersUser;
