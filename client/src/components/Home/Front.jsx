import {
    Box,
    Button,
    Center,
    Heading,
    Image,
    Stack,
  } from '@chakra-ui/react';
  import { Link } from 'react-router-dom';
  import img from './abc.jpg';
  
  const Front = () => {
    return (
      <Box height="100vh" position="relative" overflow="hidden">
        {/* Landscape Background */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          backgroundImage={`url(${img})`} // Path to your landscape background image
          backgroundSize="cover"
          opacity="0.8" // Adjust opacity as needed
          zIndex="-1"
        ></Box>
  
        {/* Content */}
        <Box
          height="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          position="relative"
          zIndex="10"
        >
          <Heading
            as="h1"
            size="3xl"
            textAlign="center"
            color="white"
            marginBottom="20px"
          >
            FeedMeNow
          </Heading>
          <Stack direction="row" spacing="8">
            <Link to="/users/login">
              <Button
                colorScheme="blue"
                size="lg"
                mt={20}
                width="200px"
                borderRadius="full"
                boxShadow="lg"
                _hover={{ bg: 'blue.600' }}
              >
                Login as User
              </Button>
            </Link>
            <Link to="/restaurants/login">
              <Button
                colorScheme="blue"
                size="lg"
                mt={20}
                width="200px"
                borderRadius="full"
                boxShadow="lg"
                _hover={{ bg: 'blue.600' }}
              >
                Login as Restaurant
              </Button>
            </Link>
          </Stack>
        </Box>
      </Box>
    );
  };
  
  export default Front;