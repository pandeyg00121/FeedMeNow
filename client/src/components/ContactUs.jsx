import React from 'react';
import {
  Box,
  Heading,
  Text,
  Link,
  Icon,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Footer from './Layout/Footer';
import Navbar from './Layout/Navbar';

const ContactUs = () => {
  const handleSubmit = e => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <>
    <Navbar/>
    <Box p={8} bg={bgColor} borderRadius="lg" boxShadow="lg">
      <Heading as="h1" size="2xl" mb={4}>
        Contact Us
      </Heading>
      <VStack align="start" spacing={4}>
        <Box>
          <Text fontSize="lg">
            <Icon as={FaPhone} mr={2} />
            Phone: <Link href="tel:123-456-7890">123-456-7890</Link>
          </Text>
        </Box>
        <Box>
          <Text fontSize="lg">
            <Icon as={FaEnvelope} mr={2} />
            Email: <Link href="mailto:info@example.com">info@example.com</Link>
          </Text>
        </Box>
        <Box>
          <Text fontSize="lg">
            <Icon as={FaMapMarkerAlt} mr={2} />
            Address: 1234 Food Street, City, Country
          </Text>
        </Box>
      </VStack>
      <Box mt={8}>
        <Heading as="h2" size="lg" mb={4}>
          Send us a message
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack align="start" spacing={4}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Your name"
                bg="white"
                borderColor={borderColor}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Your email"
                bg="white"
                borderColor={borderColor}
              />
            </FormControl>
            <FormControl id="message" isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea
                placeholder="Write your message here..."
                rows={5}
                bg="white"
                borderColor={borderColor}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              w="100%"
              _hover={{ bg: 'teal.500' }}
            >
              Submit
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
    <Footer/>
    </>
  );
};

export default ContactUs;