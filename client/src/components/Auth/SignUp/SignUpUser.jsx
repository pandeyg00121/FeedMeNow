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
  RadioGroup,
  Radio,
  Stack,
  Divider,
} from '@chakra-ui/react';

import img from './OIG2.jpeg';
import { Link } from 'react-router-dom';
const SignUpUser = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    profileType: 'user',
  });

  const [showForm, setShowForm] = useState(true);
  const toast = useToast();

  const handleChange = e => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
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
      <VStack spacing={8} align="center" justify="center" height="100vh">
        <SlideFade in={showForm} offsetY="20px">
          <Box
            bgColor="rgba(255, 255, 255, 0.9)"
            p={8}
            width="md" // Set the width to 100% for responsiveness
            borderWidth={1}
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
              <FormControl mb={4}>
                <HStack spacing={4} justifyContent="center">
                  <Link to="/users/signup">
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
                  </Link>
                  <Link to="/restaurants/signup">
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
                  </Link>
                </HStack>
              </FormControl>

              <FormControl mb={1}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  required
                  borderColor={'darkblue'}
                />
              </FormControl>

              <FormControl mb={1}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                  borderColor={'darkblue'}
                />
              </FormControl>

              <FormControl mb={1}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                  borderColor={'darkblue'}
                />
              </FormControl>

              <FormControl mb={1}>
                <FormLabel>Re-enter Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  required
                  borderColor={'darkblue'}
                />
              </FormControl>
              <FormControl mb={1}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                >
                  <HStack spacing={4}>
                    <Radio value="male" borderColor={'darkblue'}>
                      male
                    </Radio>
                    <Radio value="female" borderColor={'darkblue'}>
                      female
                    </Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <Stack spacing="6" marginTop={5}>
                <Button type="submit" colorScheme="purple" width="full">
                  Sign Up
                </Button>
              </Stack>
            </form>
          </Box>
        </SlideFade>
      </VStack>
    </Box>
  );
};

export default SignUpUser;
