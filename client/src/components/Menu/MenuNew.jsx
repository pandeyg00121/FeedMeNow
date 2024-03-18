import React, { useState, useEffect } from 'react';
import {
  Box,
  Image,
  Text,
  Button,
  IconButton,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
  VStack,
  ChakraProvider,
} from '@chakra-ui/react';
import { FiClock, FiInfo, FiPlus, FiMinus } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useGetRestaurantOneQuery } from '../../redux/api';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import img from '../../assets/backgroundImages/OIG2.jpeg';
import { useNewFoodItemMutation } from '../../redux/api';
import { useUpdatefoodItemMutation } from '../../redux/api';
import {
  setCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
} from '../../redux/features/slices/CartSlice';
import { Link } from 'react-router-dom';
const FoodItemCard = ({ _id, restaurant, name, price, type, category }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart?.items || []);
  const isInCart = cartItems.some(item => item.foodId === _id);
  const cartQuantity =
    cartItems.find(item => item.foodId === _id)?.quantity || 0;
  const [addnewitem, { isLoading, isError }] = useNewFoodItemMutation();
  const [updateitem, { isLoadingupdate, isErrorupdate }] =
    useUpdatefoodItemMutation();
  const [quantity, setQuantity] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
      dispatch(setCartItems(storedCartItems));
    }
  }, [dispatch]);

  useEffect(() => {
    if (isInCart) {
      setQuantity(cartQuantity);
    }
  }, [isInCart, cartQuantity]);

  const handleAddToCart = async () => {
    try {
      const res = await addnewitem({ foodId: _id }).unwrap();
      const itemInCart = cartItems.find(item => item.foodId === _id);
      if (itemInCart) {
        dispatch(
          updateQuantity({
            foodId: _id,
            quantity: itemInCart.quantity + 1,
            restaurantId: restaurant,
          })
        );
      } else {
        dispatch(
          addToCart({
            foodId: _id,
            quantity: 1,
            restaurantId: restaurant,
          })
        );
      }
      setQuantity(quantity + 1);
    } catch (err) {
      console.error(err?.data?.message || err.error);
    }
  };
  useEffect(() => {
    // Update local storage whenever cartItems change
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  const handleIncreaseQuantity = async () => {
    try {
      const res = await updateitem({ foodId: _id, action: '+' }).unwrap();
      dispatch(
        updateQuantity({
          foodId: _id,
          quantity: cartQuantity + 1,
          restaurantId: restaurant,
        })
      );
      setQuantity(prevQuantity => prevQuantity + 1);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (err) {
      console.error(err?.data?.message || err.error);
    }
  };

  const handleDecreaseQuantity = async () => {
    try {
      const res = await updateitem({ foodId: _id, action: '-' }).unwrap();
      if (quantity > 1) {
        setQuantity(prevQuantity => prevQuantity - 1);
        dispatch(
          updateQuantity({
            foodId: _id,
            quantity: cartQuantity - 1,
            restaurantId: restaurant,
          })
        );
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (err) {
      console.error(err?.data?.message || err.error);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.05)' }}
    >
      <Image src={img} alt={name} boxSize="300px" objectFit="cover" />
      <Box p={4}>
        <Text fontSize="xl" fontWeight="semibold" mb={1}>
          {name}
        </Text>
        <Text color="gray.600" fontSize="sm" mb={2}>
          Price: ${price}
        </Text>
        <Flex align="center" mb={2}>
          <Text
            fontSize="sm"
            color={type === 'Veg' ? 'green.500' : 'red.500'}
            mr={2}
          >
            {type}
          </Text>
          <Text fontSize="sm" color="gray.600">
            Category: {category}
          </Text>
        </Flex>
        {quantity > 0 ? (
          <Flex align="center">
            <IconButton
              aria-label="Decrease Quantity"
              icon={<FiMinus />}
              onClick={handleDecreaseQuantity}
            />
            <Text mx={2}>{quantity}</Text>
            <IconButton
              aria-label="Increase Quantity"
              icon={<FiPlus />}
              onClick={handleIncreaseQuantity}
            />
          </Flex>
        ) : (
          <Button colorScheme="teal" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        )}
        <IconButton
          aria-label="Info"
          icon={<FiInfo />}
          ml={2}
          onClick={handleOpenModal}
        />
      </Box>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{name}</ModalHeader>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </Box>
  );
};

const RestaurantMenuPage = () => {
  const { slug } = useParams();
  const { isLoading, isError, isSuccess, data, error } =
    useGetRestaurantOneQuery(slug);
  const [restaurantInfo, setRestaurantInfo] = useState([]);

  useEffect(() => {
    console.log('isLoading:', isLoading);
    console.log('isError:', isError);
    console.log('isSuccess:', isSuccess);
    console.log('error:', error);
  }, [isLoading, isError, isSuccess, error]);

  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      console.log('Data:', data);
      setRestaurantInfo(data);
    }
  }, [isLoading, isSuccess, data]);

  const [filterType, setFilterType] = useState(''); // State for filter type
  const [sortBy, setSortBy] = useState(''); // State for sorting

  const handleSortChange = e => {
    setSortBy(e.target.value);
  };

  return (
    <ChakraProvider>
      <Flex direction="row" minHeight="100vh">
        {/* Sidebar */}
        <Box bg="gray.100" w="300px" p={4}>
          <VStack align="stretch" spacing={4}>
            {/* Filter */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={2}>
                Filter by Type:
              </Text>
              <Select
                placeholder="Select type"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="">All</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </Select>
            </Box>

            {/* Sorting */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={2}>
                Sort by:
              </Text>
              <Select
                placeholder="Select option"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="">Default</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
              </Select>
            </Box>
            {/* View Cart Button */}
            <Link to="/users/viewcart">
              <Button colorScheme="teal">View Cart</Button>
            </Link>
          </VStack>
        </Box>

        {/* Main Content */}
        <Flex direction="column" flex="1" p={4}>
          {/* Restaurant Photo */}
          {restaurantInfo && (
            <Image
              src={img}
              alt="Restaurant Photo"
              width="100%"
              height="500px" // Setting height to "auto" to maintain aspect ratio
              objectFit="cover" // Ensures the image covers the box size without stretching
            />
          )}

          {/* Restaurant Info */}
          <Box p={4} bg="white" borderRadius="lg" mt={4}>
            <Text fontSize="xl" fontWeight="semibold" mb={2}>
              {restaurantInfo.name}
            </Text>
            <Text color="gray.600" fontSize="sm" mb={2}>
              {restaurantInfo.address}
            </Text>
            <Flex align="center" mb={2}>
              <Box color="teal.500" as={FiClock} mr={2} />
              <Text color="gray.600" fontSize="sm">
                {restaurantInfo.rating} (Based on reviews)
              </Text>
            </Flex>
          </Box>

          {/* Food Items */}
          <Flex direction="row" flexWrap="wrap" justify="center" maxW="100%">
            {(restaurantInfo.foods || [])
              .filter(item => !filterType || item.type === filterType)
              .sort((a, b) => {
                if (sortBy === 'priceAsc') {
                  return a.price - b.price;
                } else if (sortBy === 'priceDesc') {
                  return b.price - a.price;
                } else if (sortBy === 'nameAsc') {
                  return a.name.localeCompare(b.name);
                } else if (sortBy === 'nameDesc') {
                  return b.name.localeCompare(a.name);
                } else {
                  return 0;
                }
              })
              .map(foodItem => (
                <Box
                  key={foodItem.id} // Assuming foodItem has an id property
                  mx={2}
                  my={3}
                  width={{ base: '100%', sm: '48%', md: '32%', lg: '20%' }}
                >
                  <FoodItemCard
                    _id={foodItem._id}
                    restaurant={foodItem.restaurant}
                    name={foodItem.name}
                    price={foodItem.price}
                    type={foodItem.type}
                    category={foodItem.category}
                  />
                </Box>
              ))}
          </Flex>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default RestaurantMenuPage;
