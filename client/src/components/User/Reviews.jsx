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
  VStack,
} from '@chakra-ui/react';
import { useGetUserReviewsQuery } from '../../redux/api';

const Reviews = () => {
  
  const [reviews,setReviews]=useState([]);
  const{data,isLoading}=useGetUserReviewsQuery("");
  
  useEffect(()=>{
    if(!isLoading && data){
      setReviews(data);
    }
  },[isLoading,data])

  return (
    <Box p={4} maxW="90%" mx="auto">
      <Heading mb={4} textAlign="center" color="teal.500" fontSize="2xl">
        Reviews
      </Heading>
      {reviews.map(review => (
        <ReviewObject review={review}/>
      ))}
      
    </Box>
  );
};

function ReviewObject({review}){
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const handleViewDetails = review => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

return(
  <Box bg="gray.100" p={4} borderRadius="lg" mb={4}>
          <Stack direction="row" align="center" justify="space-between" mb={2}>
            <Text fontWeight="bold" fontSize="lg">
              Review Id: {review._id}
            </Text>
            <Text fontWeight="bold" color="teal.500">
              Rating: {review.rating}/5
            </Text>
          </Stack>
          <Text fontSize="xl">{review.review}</Text>
          <Text fontSize="lg" color="gray.500">
            Posted On: {review.createdAt.split("T")[0]+" "+review.createdAt.split("T")[1].split(".")[0]}
          </Text>
          <Stack direction="row" justify="flex-end" mt={4}>
            <Button
              colorScheme="blue"
              onClick={() => handleViewDetails(review)}
            >
              View Details
            </Button>
          </Stack>
          <Divider />
          <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md" p={4} maxW="800px">
          <ModalHeader fontSize="2xl" fontWeight="bold" color="teal.500">
            Review Details
          </ModalHeader>
          <ModalCloseButton color="teal.500" />
          <ModalBody>
            {selectedReview && (
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  Review Id: {selectedReview._id}
                </Text>
                <Text fontWeight="bold" fontSize="lg">
                  Rating: {selectedReview.rating}/5
                </Text>
                <VStack>
                  {
                    selectedReview.order.items.map(f=>(
                      <Text>{f.food} x {f.quantity}</Text>
                    ))
                  }
                </VStack>
                <Text fontSize="xl">Review: {selectedReview.review}</Text>
                <Text fontSize="lg" color="gray.500">
                  Posted On: {selectedReview.createdAt.split("T")[0]+" "+selectedReview.createdAt.split("T")[1].split(".")[0]}
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

export default Reviews;
