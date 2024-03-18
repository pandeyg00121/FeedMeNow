import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Flex,
  Input,
  IconButton,
  VStack,
  Button,
  Select,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useGetAllRestaurantsPublicQuery } from '../../redux/api';
import { Link } from 'react-router-dom';
import img1 from '../../assets/backgroundImages/homepage.jpeg';

// RestaurantCard component
const RestaurantCard = ({
  slug,
  name,
  location,
  ratingsAverage,
  ratingsQuantity,
  active,
}) => {
  return (
    <Link to={`/restaurant/${slug}`}>
      <Box
        maxW="300px"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="lg"
        transition="transform 0.2s"
        _hover={{ transform: 'scale(1.05)' }}
        bg="white"
        color="gray.800"
        mb={4}
      >
        <img
          src={img1}
          alt={name}
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
        <Box p={4}>
          <Text fontSize="xl" fontWeight="semibold" mb={1}>
            {name}
          </Text>
          <Text color="gray.600" fontSize="sm" mb={2}>
            {location.address}
          </Text>
          <Text fontSize="sm" mb={2}>
            {ratingsAverage}⭐
          </Text>
          <Text fontSize="sm" mb={2}>
            {active ? 'Open' : 'Closed'}
          </Text>
        </Box>
      </Box>
    </Link>
  );
};

// Sidebar component
const Sidebar = ({ sortBy, handleSortChange, sortOptions }) => {
  return (
    <Box
      bg="white"
      p={4}
      borderRadius="md"
      height="100vh"
      width="250px"
      position="fixed" // Position the sidebar fixed to stay at its place while scrolling
    >
      <VStack align="stretch" spacing={4}>
        <Box>
          <Text fontWeight="bold" mb={2}>
            Sort by:
          </Text>
          <Select
            value={sortBy}
            onChange={e => handleSortChange(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Box>
        <Link to="/users/viewcart">
          <Button colorScheme="teal" size="md" w="100%">
            View Cart
          </Button>
        </Link>
        <Link to="/foods">
          <Button colorScheme="teal" size="md" w="100%">
            View All Foods
          </Button>
        </Link>
      </VStack>
    </Box>
  );
};

// AllRestaurants component
function AllRestaurants() {
  const { isLoading, isError, isSuccess, data, error } =
    useGetAllRestaurantsPublicQuery('');
  const [restaurantData, setRestaurantData] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isLoading && data) {
      setRestaurantData(data);
    }
  }, [isLoading, data]);

  const handleSortChange = value => {
    setSortBy(value);
  };

  const sortOptions = [
    { value: '', label: 'Sort by' },
    { value: 'nameAZ', label: 'Name (A-Z)' },
    { value: 'nameZA', label: 'Name (Z-A)' },
    { value: 'rating', label: 'Rating' },
  ];

  const sortRestaurants = (restaurants, sortBy) => {
    switch (sortBy) {
      case 'nameAZ':
        return [...restaurants].sort((a, b) => a.name.localeCompare(b.name));
      case 'nameZA':
        return [...restaurants].sort((a, b) => b.name.localeCompare(a.name));
      case 'rating':
        return [...restaurants].sort(
          (a, b) => b.ratingsAverage - a.ratingsAverage
        );
      default:
        return restaurants;
    }
  };

  const filteredRestaurants = restaurantData.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedRestaurants = sortRestaurants(filteredRestaurants, sortBy);

  return (
    <ChakraProvider>
      <Flex direction="row">
        {/* Sidebar */}
        <Sidebar
          sortBy={sortBy}
          handleSortChange={handleSortChange}
          sortOptions={sortOptions}
        />
        <Flex
          direction="column"
          flex={1}
          p={4}
          bg="gray.100"
          minHeight="100vh"
          ml="250px"
        >
          {' '}
          {/* Adjusted margin left to accommodate the sidebar width */}
          {/* Header */}
          <Flex justify="space-between" align="center" mb={4}>
            {/* Title */}
            <Text fontSize="3xl" fontWeight="bold" color="gray.800">
              All Restaurants
            </Text>
            {/* Search bar */}
            <Flex>
              <Input
                placeholder="Search by restaurant name"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                size="xl"
                mr={2}
              />
              <IconButton
                aria-label="Search"
                icon={<SearchIcon />}
                onClick={() => {}}
                size="sm"
                colorScheme="teal"
                mr={3}
              />
            </Flex>
          </Flex>
          {/* Restaurant cards */}
          <Flex direction="row" flexWrap="wrap" justify="center">
            {sortedRestaurants.map(restaurant => (
              <Box
                key={restaurant.id}
                mx={2}
                my={3}
                width={{ base: '100%', sm: '48%', md: '32%', lg: '20%' }}
              >
                <RestaurantCard {...restaurant} />
              </Box>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default AllRestaurants;
