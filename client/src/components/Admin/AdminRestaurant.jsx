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
import { useGetAllRestaurantsQuery,useDeleteResMutation } from '../../redux/api';


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
  const {data,isLoading}=useGetAllRestaurantsQuery("");
  const [deleteRes]=useDeleteResMutation();
  const toast = useToast();

  useEffect(() => {
    if(!isLoading && data){
      setRestaurants(data);
    }
  }, [isLoading,data]);

  const handleDeleteRestaurant = async (restaurantId)=> {
    try {
      deleteRes(restaurantId);
      const updatedRestaurants=restaurants.filter((restaurant)=>restaurant._id!==restaurantId)
      setRestaurants(updatedRestaurants);
    } catch (error) {
      console.log(error)
    }
  
    toast({
      title: 'Restaurant Deleted',
      description: `Restaurant with ID ${restaurantId} has been deleted.`,
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
          Admin Restaurant Page
        </Heading>

        {isLoading ? (
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
                <Row restaurant={restaurant} handleDeleteRestaurant={handleDeleteRestaurant}/>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Sidebar />
    </Grid>
  );
};

function Row({restaurant,handleDeleteRestaurant}){
  
  return(
    <Tr>
                  <Td>{restaurant._id}</Td>
                  <Td>
                    <Avatar
                      size="md"
                      name={restaurant.name}
                      src={restaurant.images[0]}
                    />
                  </Td>
                  <Td>{restaurant.name}</Td>
                  <Td>{restaurant.location.address}</Td>
                  <Td>{restaurant.email}</Td>
                  <Td>{restaurant.ratingsAverage}</Td>
                  <Td>
                    <Badge
                      colorScheme={restaurant.active ? 'green' : 'red'}
                      variant="solid"
                    >
                      {restaurant.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      onClick={() => handleDeleteRestaurant(restaurant._id)}
                    />
                  </Td>
                </Tr>
  )
}


export default AdminRestaurantPage;
