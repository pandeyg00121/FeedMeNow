import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Spinner,
  useToast,
  Grid,
} from '@chakra-ui/react';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { useAcceptPendingReqMutation, useGetPendingReqAdminQuery } from '../../redux/api';

// Simulated restaurant request data
const restaurantRequestsData = [
  {
    id: 1,
    name: 'New Restaurant 1',
    location: 'City, Country',
    email: 'newrestaurant1@example.com',
    rating: 0, // or set to pending
    status: 'pending',
  },
  {
    id: 2,
    name: 'New Restaurant 2',
    location: 'City, Country',
    email: 'newrestaurant2@example.com',
    rating: 0, // or set to pending
    status: 'pending',
  },
  // Add more restaurant request data as needed
];

const AdminRestaurantRequestPage = () => {
  const [restaurantRequests, setRestaurantRequests] = useState([]);
  const {data,isLoading}=useGetPendingReqAdminQuery("");
  
  const toast = useToast();

  useEffect(() => {
   if(!isLoading && data){
    setRestaurantRequests(data);
   }
  }, [isLoading,data]);

  const handleDeleteRequest = (requestId) => {
   const updatedRequests=restaurantRequests.filter((request)=>request._id!==requestId);
    setRestaurantRequests(updatedRequests);
    toast({
      title: 'Request Deleted',
      description: `Request with ID ${requestId} has been deleted.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  


  return (
    <Grid templateColumns="1fr auto" gap="4" height="100vh">
      <Box
        p="4"
        borderWidth="2px"
        borderColor="gold"
        borderRadius="md"
        width="100%"
        overflow="auto"
      >
        <Heading mb="4" textAlign="center" fontSize="2xl">
          Admin Restaurant Request Page
        </Heading>

        {isLoading ? (
          <Spinner size="lg" color="teal.500" />
        ) : (
          <Table variant="simple" mt="4" fontSize="lg" width="100%">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Restaurant Name</Th>
                <Th>Location</Th>
                <Th>Email</Th>
                <Th>Action</Th>
                <Th>Status</Th> 
              </Tr>
            </Thead>
            <Tbody>
              {restaurantRequests.map(request => (
                <Row request={request} handleDeleteRequest={handleDeleteRequest} toast={toast}/>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Sidebar />
    </Grid>
  );
};

function Row({request,handleDeleteRequest,toast}){
  const [acceptReq]=useAcceptPendingReqMutation();

  const handleAcceptRequest = async(requestId) => {
    try {
      await acceptReq(requestId)
    } catch (error) {
      console.log(error);
    }

    toast({
      title: 'Request Accepted',
      description: `Request with ID ${requestId} has been accepted.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return(
    <Tr>
                  <Td>{request._id}</Td>
                  <Td>{request.name}</Td>
                  <Td>{request.location.address}</Td>
                  <Td>{request.email}</Td>
                  <Td>
                    {request.active === false && (
                      
                        <IconButton
                          icon={<FaCheck />}
                          colorScheme="green"
                          onClick={() => handleAcceptRequest(request._id)}
                        />
                        
                    )}
                  </Td>
                  <Td>
                    {request.active === false && 'Pending'}
                    {request.status === true && (
                      <Badge colorScheme="green">Accepted</Badge>
                    )}
                  </Td>
                  <Td>
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      onClick={() => handleDeleteRequest(request._id)}
                    />
                  </Td>
                </Tr>
  )
}

export default AdminRestaurantRequestPage;
