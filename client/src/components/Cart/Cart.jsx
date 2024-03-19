import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Text,
  Image,
  HStack,
  Spacer,
  Heading,
  Divider,
  Checkbox,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import RestaurantCart from './RestaurantCart';
import img from '../../assets/cod.png';
import img1 from '../../assets/cp.png';
import {
  useDeleteCartMutation,
  useGetMyCartQuery,
  usePlaceOrderMutation,
} from '../../redux/api';
import { removeFromCart } from '../../redux/features/slices/CartSlice';
import { clearCart } from '../../redux/features/slices/CartSlice';
// Dummy data for items
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import { useNavigate } from 'react-router-dom';
// Motion components for animation
const MotionBox = motion(Box);
const MotionText = motion(Text);

const OrderPage = () => {
  const navigate=useNavigate();
  useEffect(() => {}, []);
  // State for selected items, payment method, and confirmation button label
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, data, error } = useGetMyCartQuery('');
  console.log(isLoading, isError, isSuccess, data, error);
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    if (!isLoading && data) {
      setSelectedItems(data);
    }
  }, [isLoading, data]);
  console.log(selectedItems);
  useEffect(() => {
    const subtotal = calculateRestaurantSubtotal(selectedItems);
    console.log('Subtotal:', subtotal);
    // Perform any other operations here
  }, [selectedItems]);
  const [deletecart, { isLoadingdelete, isErrordelete }] =
    useDeleteCartMutation();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [confirmationButtonLabel, setConfirmationButtonLabel] =
    useState('Confirm Order');

  // Function to handle payment confirmation
  const [placeOrder] = usePlaceOrderMutation();
  const handlePayment = async () => {
    try {
      dispatch(clearCart());
      localStorage.removeItem('cartItems');

      await placeOrder();
      navigate('/payment/success');
    } catch (error) {
      console.log(error);
    }
  };

  // Function to calculate restaurant subtotal
  const calculateRestaurantSubtotal = restaurantItems => {
    return restaurantItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  };

  function calculateTotalPrice(items) {
    let totalPrice = 0;
    for (let i = 0; i < items.length; i++) {
      totalPrice += items[i].rPrice;
    }
    return totalPrice;
  }

  const totalPrice = calculateTotalPrice(selectedItems);
  const handlePaymentMethodChange = e => {
    setPaymentMethod(e);
    setConfirmationButtonLabel(
      e === 'cash' ? 'Confirm Order' : 'Proceed to Payment'
    );
  };
  const cartItems = useSelector(state => state.cart.items || []);
  useEffect(() => {
    // Update local storage whenever cartItems change
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  const handleclearcart = async () => {
    try {
      dispatch(clearCart());
      localStorage.removeItem('cartItems');
      setSelectedItems([]);
      await deletecart().unwrap();
      console.log('Cart data cleared successfully.');
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  };

  // Filter checked restaurants  const checkedRestaurants = selectedItems.filter(item => item.isChecked);

  // Calculate total subtotal
  const subtotal = selectedItems.reduce((acc, restaurant) => {
    return (
      acc +
      restaurant.items.reduce((itemAcc, item) => {
        return itemAcc + item.price * item.quantity;
      }, 0)
    );
  }, 0);

  return (
    <>
    <Navbar/>
    <VStack
      spacing="4"
      align="start"
      p="4"
      bgColor={useColorModeValue('gray.100', 'gray.800')}
      borderRadius="lg"
      boxShadow="dark-lg"
    >
      {/* Order heading */}
      <Heading as="h1" size="xl" mb="4" color="teal.500">
        Your Order
      </Heading>

      {/* Display selected items in a grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="4" width="100%">
        {selectedItems.map((restaurant, index) => (
          <RestaurantCart
            key={index}
            restaurant={restaurant.restaurant}
            items={restaurant.items}
          />
        ))}
      </SimpleGrid>

      {/* Payment details section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        align="center"
        spacing="4"
        p="4"
        borderWidth="1px"
        borderRadius="lg"
        width="100%"
        bgColor={useColorModeValue('white', 'gray.800')}
        borderColor="teal.500"
      >
        {/* Subtotal and Clear Cart button */}
        <HStack w="100%" justify="space-between">
          <Heading as="h2" size="md" color="teal.500">
            Subtotal
          </Heading>
          <Button size="sm" colorScheme="red" onClick={() => handleclearcart()} mb={3}>
            Clear Cart
          </Button>
        </HStack>

        {/* Divider */}
        <Divider borderColor="teal.500" />

        {/* Display restaurant details */}
        {selectedItems.map(restaurant => (
          <MotionBox
            key={restaurant.restaurant}
            w="100%"
            mb="2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MotionText
              fontWeight="bold"
              fontSize="large"
              color="teal.500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {restaurant.restaurant}
            </MotionText>

            {restaurant.items.map(item => (
              <MotionBox
                key={item.id}
                ml="2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <MotionText color="gray.700">
                  {item.name} - ₹{item.price}
                </MotionText>
              </MotionBox>
            ))}
            <MotionText color="teal.500">
              {restaurant.restaurant} Total: ₹{restaurant.rPrice}
            </MotionText>
          </MotionBox>
        ))}

        {/* Divider */}
        <Divider borderColor="teal.500" />

        {/* Display total */}
        <Heading as="h5" fontSize="2xl" color="teal.500">
          Total: ₹{totalPrice}
        </Heading>

        {/* Payment method selection */}
        <FormControl w="100%">
          <FormLabel fontSize="lg" fontWeight="bold" color="teal.500">
            Select Payment Method:
          </FormLabel>
        </FormControl>

        {/* Confirmation button */}
        <Button
          onClick={handlePayment}
          mt="4"
          colorScheme="teal"
          _hover={{ bg: 'teal.600' }}
        >
          Proceed To Payment
        </Button>
      </MotionBox>
    </VStack>
    <Footer/>
    </>
  );
};

export default OrderPage;
