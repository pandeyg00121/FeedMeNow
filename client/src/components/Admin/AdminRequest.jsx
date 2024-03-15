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
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Simulate fetching restaurant requests data from an API or database
    // In a real-world scenario, you would fetch this data from your server
    // For demonstration purposes, using a timeout to simulate an asynchronous operation
    const fetchData = async () => {
      try {
        // Simulating an asynchronous data fetch
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRestaurantRequests(restaurantRequestsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant request data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteRequest = requestId => {
    // In a real-world scenario, you would send a request to your backend to delete the restaurant request
    // For demonstration purposes, simply updating the state here
    setRestaurantRequests(prevRequests =>
      prevRequests.filter(request => request.id !== requestId)
    );

    toast({
      title: 'Request Deleted',
      description: `Request with ID ${requestId} has been deleted.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAcceptRequest = requestId => {
    // In a real-world scenario, you would send a request to your backend to accept the restaurant request
    // For demonstration purposes, simply updating the state here
    setRestaurantRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId ? { ...request, status: 'accepted' } : request
      )
    );

    toast({
      title: 'Request Accepted',
      description: `Request with ID ${requestId} has been accepted.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDenyRequest = requestId => {
    // In a real-world scenario, you would send a request to your backend to deny the restaurant request
    // For demonstration purposes, simply updating the state here
    setRestaurantRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId ? { ...request, status: 'rejected' } : request
      )
    );

    toast({
      title: 'Request Denied',
      description: `Request with ID ${requestId} has been denied.`,
      status: 'error',
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

        {loading ? (
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
                <Th>Status</Th> {/* New Status column */}
              </Tr>
            </Thead>
            <Tbody>
              {restaurantRequests.map(request => (
                <Tr key={request.id}>
                  <Td>{request.id}</Td>
                  <Td>{request.name}</Td>
                  <Td>{request.location}</Td>
                  <Td>{request.email}</Td>
                  <Td>
                    {request.status === 'pending' && (
                      <>
                        <IconButton
                          icon={<FaCheck />}
                          colorScheme="green"
                          onClick={() => handleAcceptRequest(request.id)}
                        />
                        <IconButton
                          ml={2}
                          icon={<FaTimes />}
                          colorScheme="red"
                          onClick={() => handleDenyRequest(request.id)}
                        />
                      </>
                    )}
                  </Td>
                  <Td>
                    {request.status === 'pending' && 'Pending'}
                    {request.status === 'accepted' && (
                      <Badge colorScheme="green">Accepted</Badge>
                    )}
                    {request.status === 'rejected' && (
                      <Badge colorScheme="red">Rejected</Badge>
                    )}
                  </Td>
                  <Td>
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      onClick={() => handleDeleteRequest(request.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Sidebar />
    </Grid>
  );
};

export default AdminRestaurantRequestPage;
