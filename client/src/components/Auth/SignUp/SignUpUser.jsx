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
  Select, // Import Select component
  Stack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSignupMutation } from '../../../redux/features/slices/authUserApi';
import img from '../../../assets/backgroundImages/OIG2.jpeg';
import { Link } from 'react-router-dom';

const SignUpUser = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    gender: '',
  });
  const [signup, { isLoading, isError, error }] = useSignupMutation();
  const [showForm, setShowForm] = useState(true);
  const [isUser, setIsUser] = useState(true); // Tracks if user button is clicked
  const toast = useToast();
  const navigate = useNavigate();
  const handleChange = e => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(userData);
    if (userData.password !== userData.passwordConfirm) {
      alert('Passwords do not match');
    } else {

      try {
        toast({
          title: 'Verification Link',
          description: `Verification link has been sent to the e-mail.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await signup(userData).unwrap();
        
        navigate('/users/login');
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
                  <Button
                    colorScheme={isUser ? 'purple' : 'white'}
                    color={isUser ? 'white' : 'black'}
                    size="sm"
                    fontSize="sm"
                    onClick={() => setIsUser(true)}
                  >
                    User
                  </Button>
                  <Link to="/restaurants/signup">
                    <Button
                      colorScheme={!isUser ? 'purple' : 'white'}
                      color={!isUser ? 'white' : 'black'}
                      size="sm"
                      fontSize="sm"
                      onClick={() => setIsUser(false)}
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
                  name="name"
                  value={userData.name}
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
                  name="passwordConfirm"
                  value={userData.passwordConfirm}
                  onChange={handleChange}
                  required
                  borderColor={'darkblue'}
                />
              </FormControl>

              <FormControl mb={1}>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  borderColor={'darkblue'}
                  required // Add required attribute to enforce selection
                >
                  <option value="">Select Option</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
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
