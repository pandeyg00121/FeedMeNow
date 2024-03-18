import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Select,
  Text,
  Flex,
  Box,
  Image,
  Badge,
  Input,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
  Button,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  useGetAllFoodsQuery,
  useUpdatefoodItemMutation,
} from '../../redux/api';
import { useDispatch } from 'react-redux';
import img1 from '../../assets/backgroundImages/homepage.jpeg';
import { useNewFoodItemMutation } from '../../redux/api';
import {
  setCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
} from '../../redux/features/slices/CartSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const FoodItemCard = ({
  _id,
  name,
  type,
  category,
  price,
  description,
  restaurant,
}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart?.items || []);
  const isInCart = cartItems.some(item => item.foodId === _id);
  const cartQuantity =
    cartItems.find(item => item.foodId === _id)?.quantity || 0;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [quantity, setQuantity] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(isInCart);
  const [uniqueRestaurantIds, setUniqueRestaurantIds] = useState(new Set());
  const [addnewitem, { isLoading, isError }] = useNewFoodItemMutation();
  const [updateitem, { isLoadingupdate, isErrorupdate }] =
    useUpdatefoodItemMutation();
  const toast = useToast();
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
  useEffect(() => {
    const ids = new Set(cartItems.map(item => item.restaurantId));
    setUniqueRestaurantIds(ids);
  }, [cartItems]);
  const handleAddToCart = async () => {
    if (uniqueRestaurantIds.size > 3) {
      toast({
        title: 'Cannot add item',
        description: 'Maximum 3 restaurants allowed in the cart.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
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
          addToCart({ foodId: _id, quantity: 1, restaurantId: restaurant })
        );
      }
      setIsAddedToCart(true);
      setQuantity(1);
    } catch (err) {
      console.error(err?.data?.message || err.error);
    }
  };
  useEffect(() => {
    // Update local storage whenever cartItems change
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  const handleIncrement = async () => {
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

  const handleDecrement = async () => {
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

  return (
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
    >
      <Image src={img1} alt={name} boxSize="300px" objectFit="cover" />
      <Box p={4}>
        <Text fontSize="xl" fontWeight="semibold" mb={1} color="gray.800">
          {name}
        </Text>
        <Flex align="center" mb={2}>
          <Badge colorScheme={type === 'veg' ? 'green' : 'red'} mr={2}>
            {type}
          </Badge>
          <Text color="gray.600" fontSize="sm">
            {category}
          </Text>
        </Flex>
        <Text color="gray.600" fontSize="sm" mb={2}>
          Price: ${price}
        </Text>
        <Text
          color="teal.500"
          fontSize="sm"
          mb={2}
          cursor="pointer"
          onClick={onOpen}
        >
          {description}
        </Text>
        {!isAddedToCart ? (
          <Button colorScheme="teal" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        ) : (
          <Flex align="center">
            <IconButton
              aria-label="Decrease quantity"
              icon={<MinusIcon />}
              onClick={handleDecrement}
            />
            <Text mx={2}>{quantity}</Text>
            <IconButton
              aria-label="Increase quantity"
              icon={<AddIcon />}
              onClick={handleIncrement}
            />
          </Flex>
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{description}</ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

function AllFoodItems() {
  const { isLoading, isError, isSuccess, data, error } =
    useGetAllFoodsQuery('');
  const [foodItemsData, setfoodItemsData] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    if (!isLoading && data) {
      setfoodItemsData(data);
    }
  }, [isLoading, data]);

  const dispatch = useDispatch();

  const handleSortChange = e => {
    setSortBy(e.target.value);
  };

  const handleShowAll = () => {
    setFilterType('');
  };

  const handleFilterByType = type => {
    setFilterType(type);
  };

  const handleViewAllRestaurants = () => {
    // Handle view all restaurants
  };

  const filteredAndSortedFoodItems = foodItemsData
    .filter(foodItem =>
      foodItem.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(foodItem =>
      foodItem.category.toLowerCase().includes(searchCategory.toLowerCase())
    )
    .filter(foodItem => (filterType ? foodItem.type === filterType : true))
    .sort((a, b) => {
      if (sortBy === 'priceLowToHigh') {
        return a.price - b.price;
      } else if (sortBy === 'priceHighToLow') {
        return b.price - a.price;
      } else if (sortBy === 'nameAZ') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'nameZA') {
        return b.name.localeCompare(a.name);
      } else {
        return 0;
      }
    });

  const sortOptions = [
    { value: '', label: 'Sort by' },
    { value: 'priceLowToHigh', label: 'Price: Low to High' },
    { value: 'priceHighToLow', label: 'Price: High to Low' },
    { value: 'nameAZ', label: 'Name: A to Z' },
    { value: 'nameZA', label: 'Name: Z to A' },
  ];

  return (
    <ChakraProvider>
      <Flex direction="row">
        <Flex direction="column" p={4}>
          <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
            Sort Options
          </Text>
          <Select
            size="sm"
            value={sortBy}
            onChange={handleSortChange}
            colorScheme="teal"
            mb={4}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>
            Filter by Type
          </Text>
          <Flex direction="column">
            <Button size="sm" onClick={() => handleFilterByType('')}>
              Show All
            </Button>
            <Button size="sm" mt={2} onClick={() => handleFilterByType('veg')}>
              Veg
            </Button>
            <Button
              size="sm"
              mt={2}
              onClick={() => handleFilterByType('non-veg')}
            >
              Non-Veg
            </Button>
          </Flex>
          <Link to="/users/viewcart">
            <Button size="sm" mt={4} ml={6} colorScheme="teal">
              View Cart
            </Button>
          </Link>
          <Link to="/restaurants">
            <Button size="sm" mt={2} onClick={handleViewAllRestaurants}>
              View All Restaurants
            </Button>
          </Link>
        </Flex>

        <Flex direction="column" p={4} bg="gray.100" minHeight="100vh" flex={1}>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="3xl" fontWeight="bold" color="gray.800">
              All Food Items
            </Text>
            <Flex align="center">
              <Input
                placeholder="Search by food item name"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                size="sm"
                ml={2}
              />
              <IconButton
                aria-label="Search"
                icon={<SearchIcon />}
                onClick={() => {
                  /* Handle search */
                }}
                size="sm"
                colorScheme="teal"
                ml={2}
              />
            </Flex>
          </Flex>

          <Flex
            direction="row"
            flexWrap="wrap"
            justify="center"
            maxW="100%"
            w="100%"
            mx="auto"
          >
            {filteredAndSortedFoodItems.map(foodItem => (
              <Box
                key={foodItem.id}
                mx={2}
                my={3}
                width={{ base: '100%', sm: '48%', md: '32%', lg: '20%' }}
              >
                <FoodItemCard {...foodItem} />
              </Box>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default AllFoodItems;
