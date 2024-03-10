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
import img from './OIG2.jpeg';
import { NavLink } from 'react-router-dom';
const SignUpRestaurant = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',

    password: '',
    confirmPassword: '',
    profileType: 'restaurant',
  });

  const [showForm, setShowForm] = useState(true);
  const toast = useToast();

  const handleChange = e => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const switchToUser = () => {
    setUserData({
      ...userData,
      profileType: 'user',
    });
  };

  const switchToAdmin = () => {
    setUserData({
      ...userData,
      profileType: 'restaurant',
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Simulating form submission. Replace with your actual API call or logic.
    setTimeout(() => {
      toast({
        title: 'Signup Successful',
        description: 'Welcome to our platform!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset the form and show success message
      setUserData({
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        profileType: 'user',
      });
      setShowForm(false);
    }, 1000);
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
                  <NavLink to="/users/signup">
                    <Button
                      colorScheme={
                        userData.profileType === 'user' ? 'purple' : 'white'
                      }
                      color={
                        userData.profileType === 'user' ? 'white' : 'black'
                      }
                      size="sm"
                      fontSize="sm"
                    >
                      User
                    </Button>
                  </NavLink>
                  <NavLink to="restaurants/signup">
                    <Button
                      colorScheme={
                        userData.profileType === 'restaurant'
                          ? 'purple'
                          : 'white'
                      }
                      color={
                        userData.profileType === 'restaurant'
                          ? 'white'
                          : 'black'
                      }
                      size="sm"
                      fontSize="sm"
                    >
                      Restaurant
                    </Button>
                  </NavLink>
                </HStack>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Re-enter Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <Stack spacing="6">
                <Button type="submit" colorScheme="purple" width="full">
                  Sign Up
                </Button>
                {userData.profileType === 'restaurant' && (
                  <>
                    <HStack>
                      <Divider />
                      <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
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
