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
  Avatar,
  Badge,
  IconButton,
  Spinner,
  Switch,
  useToast,
  Grid,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import Sidebar from './Sidebar';

// Simulated restaurant data
const restaurantsData = [
  {
    id: 1,
    logo: 'https://placekitten.com/50/50', // Example logo URL
    name: 'Pizza Palace',
    location: 'City, Country',
    email: 'pizza@example.com',
    rating: 4.5,
    isActive: true,
  },
  {
    id: 2,
    logo: 'https://placekitten.com/50/51', // Example logo URL
    name: 'Burger Barn',
    location: 'City, Country',
    email: 'burger@example.com',
    rating: 3.8,
    isActive: false,
  },
  // Add more restaurant data as needed
];

const AdminRestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Simulate fetching restaurant data from an API or database
    // In a real-world scenario, you would fetch this data from your server
    // For demonstration purposes, using a timeout to simulate an asynchronous operation
    const fetchData = async () => {
      try {
        // Simulating an asynchronous data fetch
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRestaurants(restaurantsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteRestaurant = restaurantId => {
    // In a real-world scenario, you would send a request to your backend to delete the restaurant
    // For demonstration purposes, simply updating the state here
    setRestaurants(prevRestaurants =>
      prevRestaurants.filter(restaurant => restaurant.id !== restaurantId)
    );

    toast({
      title: 'Restaurant Deleted',
      description: `Restaurant with ID ${restaurantId} has been deleted.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleStatusChange = restaurantId => {
    // In a real-world scenario, you would send a request to your backend to update the restaurant's status
    // For demonstration purposes, simply updating the state here
    setRestaurants(prevRestaurants =>
      prevRestaurants.map(restaurant =>
        restaurant.id === restaurantId
          ? { ...restaurant, isActive: !restaurant.isActive }
          : restaurant
      )
    );

    toast({
      title: 'Status Updated',
      description: `Status for Restaurant with ID ${restaurantId} has been updated.`,
      status: 'info',
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
          Admin Restaurant Page
        </Heading>

        {loading ? (
          <Spinner size="lg" color="teal.500" />
        ) : (
          <Table variant="simple" mt="4" fontSize="lg" width="100%">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Logo</Th>
                <Th>Restaurant Name</Th>
                <Th>Location</Th>
                <Th>Email</Th>
                <Th>Rating</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {restaurants.map(restaurant => (
                <Tr key={restaurant.id}>
                  <Td>{restaurant.id}</Td>
                  <Td>
                    <Avatar
                      size="md"
                      name={restaurant.name}
                      src={restaurant.logo}
                    />
                  </Td>
                  <Td>{restaurant.name}</Td>
                  <Td>{restaurant.location}</Td>
                  <Td>{restaurant.email}</Td>
                  <Td>{restaurant.rating}</Td>
                  <Td>
                    <Badge
                      colorScheme={restaurant.isActive ? 'green' : 'red'}
                      variant="solid"
                    >
                      {restaurant.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      onClick={() => handleDeleteRestaurant(restaurant.id)}
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

export default AdminRestaurantPage;
