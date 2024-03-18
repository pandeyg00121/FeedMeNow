import { useEffect, useState } from 'react';
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
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { useAddReviewMutation, useGetUserPrevOrdersQuery } from '../../redux/api';

const PreviousOrdersUser = () => {
  
  const {data,isLoading}=useGetUserPrevOrdersQuery("")
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
        Previous Orders
      </Heading>
      {orders.map((order) => 
        <ListItem order={order} />
      )}
    </Box>
  );
};

function ListItem({order}){
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating,setRating]=useState(0);
  const [review,setReview]=useState("");
  const [addReview]=useAddReviewMutation();

  const handleViewDetails = order => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
  };
  const handleReview = order => {
    setSelectedOrder(order);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleSubmit=async()=>{
    const sendReview={
      rating:rating,
      review:review
    }
    try {
      await addReview({orderId:selectedOrder._id,review:sendReview});
    } catch (error) {
      console.log(error);
    }
    setRating(0);
    setReview("");
    setIsReviewModalOpen(false);
  }
  return(
    <Box bg="gray.100" p={4} borderRadius="lg" mb={4}>
      <Stack direction="row" align="center" justify="space-between" mb={2}>
        <Text fontWeight="bold" fontSize="lg">
          Order Id: {order._id}
        </Text>
        <Text fontWeight="bold">
          {order.createdAt}
        </Text>
      </Stack>
      <Text fontWeight="bold" fontSize="xl" color="teal.600">
            {order.restaurantName}:
          </Text>
      {order.items.map(item => (
        <Stack
          direction="row"
          align="center"
          mb={5}
          mt={5}
        >
          <Text fontWeight={"bold"}>{item.foodName} x {item.quantity}</Text>
        </Stack>
      ))}
        <HStack spacing={10}>
        <Button colorScheme='green' onClick={()=>handleReview(order)}>Write a Review</Button>
        <Button colorScheme="blue" onClick={() => handleViewDetails(order)}>
          View Details
        </Button>
        </HStack>
        <Divider />
      <Modal isOpen={isViewModalOpen} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md" p={4} maxW="800px">
          <ModalHeader fontSize="xl" fontWeight="bold" color="teal.500">
            Order Details
          </ModalHeader>
          <ModalCloseButton color="teal.500" />
          <ModalBody>
            {selectedOrder && (
              <Box>
                <Text fontWeight="bold">Order Id: {selectedOrder._id}</Text>
                <Text fontWeight="bold">Date: {selectedOrder.createdAt}</Text>
                <Text fontWeight="bold">
                  Payment Method: {selectedOrder.paymentMode}
                </Text>
                <Text fontWeight="bold">Restaurant: {selectedOrder.restaurantName}</Text>
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
                <Text fontWeight="bold">Total: ₹{selectedOrder.rPrice}</Text>

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
      <Modal isOpen={isReviewModalOpen} onClose={handleCloseReviewModal} size="lg">
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md" p={4} maxW="800px">
          <ModalHeader fontSize="xl" fontWeight="bold" color="teal.500">
            Write A Review
          </ModalHeader>
          <ModalCloseButton color="teal.500" />
          <ModalBody>
            {selectedOrder && (
              <Box>
                <Text fontWeight="bold">Order Id: {selectedOrder._id}</Text>
                <Text fontWeight="bold">Date: {selectedOrder.createdAt}</Text>
                <Text fontWeight="bold">
                  Payment Method: {selectedOrder.paymentMode}
                </Text>
                <Text fontWeight="bold">Restaurant: {selectedOrder.restaurantName}</Text>
                <FormControl mt={5}>
                  <FormLabel fontWeight={"bold"} mb={3}>Rating:</FormLabel>
                  <Select onChange={(e)=>setRating(e.target.value)} >
                    <option>Select</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Select>
                  <FormLabel fontWeight={"bold"} mt={3}>Share your experience:</FormLabel>
                  <Textarea placeholder='write a review...' onChange={(e)=>setReview(e.target.value)}/>
                  <Button mt={6} type='submit' onClick={handleSubmit}>Post</Button>
                </FormControl>
                
              </Box>
            )}
          </ModalBody>
          
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default PreviousOrdersUser;
