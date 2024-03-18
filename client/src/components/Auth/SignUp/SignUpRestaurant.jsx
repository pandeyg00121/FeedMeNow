import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  VStack,
  SlideFade,
  useToast,
  HStack,
  ScaleFade,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { AuthButtonGroup } from './AuthButtonGroup';
import img from '../../../assets/backgroundImages/OIG2.jpeg';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSignupMutation } from '../../../redux/features/slices/authRestaurantApi';
import { Link } from 'react-router-dom';
const SignUpRestaurant = () => {
  const [restaurantdata, setrestaurantdata] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [signup, { isLoading, isError, error }] = useSignupMutation();
  const [isRestaurant, setIsRestaurant] = useState(true); // Track if signing up as a restaurant
  const [showForm, setShowForm] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const handleChange = e => {
    setrestaurantdata({
      ...restaurantdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(restaurantdata);
    if (restaurantdata.password !== restaurantdata.passwordConfirm) {
      alert('Passwords do not match');
    } else {
      try {
        await signup(restaurantdata).unwrap();
        navigate('/restaurants/login');
      } catch (err) {
        console.log(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Box
      maxW="100%"
      overflow="hidden"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      height="100vh"
      bgImg={img}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={4} align="center" justify="center" height="100vh">
        <SlideFade in={showForm} offsetY="20px">
          <Box
            bgColor="rgba(255, 255, 255, 0.9)"
            p={8}
            width="md"
            borderWidth={2}
            borderRadius="md"
            boxShadow="lg"
          >
            <Heading mb={4} textAlign="center">
              <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                Sign Up
              </Text>
              <Text fontSize="md" mt={2} color="gray.500">
                Create your account and join us.
              </Text>
            </Heading>
            <form onSubmit={handleSubmit}>
              <FormControl mb={2}>
                <HStack spacing={4} justifyContent="center">
                  <Link to="/users/signup">
                    <Button
                      colorScheme={isRestaurant ? 'white' : 'purple'}
                      color={isRestaurant ? 'black' : 'white'}
                      size="sm"
                      fontSize="sm"
                      onClick={() => setIsRestaurant(false)}
                    >
                      User
                    </Button>
                  </Link>
                  <Button
                    colorScheme={isRestaurant ? 'purple' : 'white'}
                    color={isRestaurant ? 'white' : 'black'}
                    size="sm"
                    fontSize="sm"
                    onClick={() => setIsRestaurant(true)}
                  >
                    Restaurant
                  </Button>
                </HStack>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={restaurantdata.name}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={restaurantdata.email}
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={restaurantdata.password}
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Re-enter Password</FormLabel>
                <Input
                  type="password"
                  name="passwordConfirm"
                  value={restaurantdata.passwordConfirm}
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <Stack spacing="6">
                <Button type="submit" colorScheme="purple" width="full">
                  Sign Up
                </Button>
                {isRestaurant && (
                  <>
                    <HStack>
                      <Divider />
                      <Text textStyle="sm" whiteSpace="nowrap" color="gray.500">
                        or continue with
                      </Text>
                      <Divider />
                    </HStack>
                    <AuthButtonGroup />
                  </>
                )}
              </Stack>
            </form>
          </Box>
        </SlideFade>

        {!showForm && (
          <Box
            p={8}
            width="md"
            bgColor="white"
            borderWidth={1}
            borderRadius="md"
            boxShadow="lg"
          >
            <Text textAlign="center">Thank you for signing up!</Text>
            <Text textAlign="center">
              You can now log in with your new account.
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default SignUpRestaurant;
