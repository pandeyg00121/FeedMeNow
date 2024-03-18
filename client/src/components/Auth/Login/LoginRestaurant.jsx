import React, { useState, useEffect } from 'react';
import {
  useLoginMutation,
  useForgotPasswordMutation,
} from '../../../redux/features/slices/authRestaurantApi';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Heading,
  Link,
  Flex,
  ChakraProvider,
  CSSReset,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { setCredentialsrestaurant } from '../../../redux/features/slices/authRestaurantSlice';
import { useDispatch, useSelector } from 'react-redux';
const LoginRestaurant = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(false);
  const [restaurant, setRestaurant] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [login, { isLoading, isError }] = useLoginMutation();
  const [forgotPassword, { isLoadingpass, isErrorpass }] =
    useForgotPasswordMutation();
  const { restaurantInfo } = useSelector(state => state.authrestaurant);
  
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleForgotPasswordInputChange = e => {
    const { value } = e.target;
    setForgotPasswordEmail(value);
  };
  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();
      dispatch(setCredentialsrestaurant({ ...res }));
      navigate('/restaurant/dashboard');
    } catch (err) {
      console.error(err?.data?.message || err.error);
    }
  };
  const handleForgotPassword = () => {
    // Implement your forgot password logic here
    onOpen();
  };

  const handleUserLogin = () => {
    // Handle user login
    console.log('User login clicked');
    setUser(true);
    setRestaurant(false);
  };

  const handleRestaurantLogin = () => {
    // Handle restaurant login
    console.log('Restaurant login clicked');
    setUser(false);
    setRestaurant(true);
  };

  const handleSubmitForgotPassword = async e => {
    e.preventDefault();
    try {
      console.log(forgotPasswordEmail);
      await forgotPassword(forgotPasswordEmail).unwrap();
      setConfirmationMessage(
        'Confirmation email has been sent to ' + forgotPasswordEmail
      );
      onClose();
    } catch (err) {
      console.error('Forgot password failed:', err);
    }
  };

  return (
    <ChakraProvider>
      <Box
        minH="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bgGradient="linear(to-r, #805ad5, #87a7d9)"
      >
        <CSSReset />
        <Box
          p={8}
          maxW={{ base: '90%', sm: '80%', md: '70%', lg: '50%' }}
          w="30%"
          borderWidth={1}
          borderRadius={12}
          boxShadow="xl"
          mx="auto"
          bg="white"
          zIndex={1}
        >
          <VStack spacing={4} align="center">
            <Heading
              color="teal.500"
              fontFamily="Poppins, sans-serif"
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
              fontWeight="bold"
              textAlign="center"
            >
              Welcome back!
            </Heading>
            <Heading
              color="gray.600"
              fontFamily="Poppins, sans-serif"
              fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }}
              fontWeight="normal"
              textAlign="center"
            >
              Securely login to your account.
            </Heading>
            <Flex justify="center" w="100%" mb={2}>
              <NavLink to="/users/login">
                <Button
                  variant="outline"
                  onClick={handleUserLogin}
                  mr={2}
                  bg={user ? 'teal.500' : 'white'} // Change background color based on user state
                  color={user ? 'white' : 'teal.500'} // Change text color based on user state
                >
                  User
                </Button>
              </NavLink>
              <NavLink to="/restaurants/login">
                <Button
                  variant="outline"
                  onClick={handleRestaurantLogin}
                  ml={2}
                  bg={restaurant ? 'teal.500' : 'white'}
                  color={restaurant ? 'white' : 'teal.500'}
                >
                  Restaurant
                </Button>
              </NavLink>
            </Flex>
            <InputGroup>
              <Input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                borderColor="teal.500"
                focusBorderColor="teal.700"
              />
            </InputGroup>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                borderColor="teal.500"
                focusBorderColor="teal.700"
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleTogglePassword}
                  colorScheme="teal"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button colorScheme="teal" bg="teal.500" onClick={handleLogin}>
              Login
            </Button>
            <Link as={NavLink} to="/restaurants/signup" color="teal.500">
              Create Account
            </Link>
            <Link color="teal.500" onClick={handleForgotPassword}>
              Forgot Password?
            </Link>
          </VStack>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Forgot Password</ModalHeader>
          <ModalBody>
            <Input
              type="email"
              placeholder="Enter your email"
              value={forgotPasswordEmail}
              onChange={handleForgotPasswordInputChange}
              borderColor="teal.500"
              focusBorderColor="teal.700"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal" onClick={handleSubmitForgotPassword}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {confirmationMessage && (
        <Box
          position="fixed"
          top="20px"
          left="50%"
          transform="translateX(-50%)"
          bg="teal.500"
          color="white"
          p={4}
          borderRadius={8}
        >
          {confirmationMessage}
        </Box>
      )}
    </ChakraProvider>
  );
};

export default LoginRestaurant;
