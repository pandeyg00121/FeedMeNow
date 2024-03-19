import React from 'react';
import { Box, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const SuccessPage = () => {
  return (
    <Box
      textAlign="center"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
    >
      <Icon as={CheckCircleIcon} w={20} h={20} color="green.500" mb={6} />
      <Heading size="lg" mb={4}>
        Payment Successful!
      </Heading>
      <Text fontSize="xl" mb={6}>
        Thank you for your payment.
      </Text>
      <Button colorScheme="blue" onClick={() => (window.location.href = '/')}>
        Go Back to Homepage
      </Button>
    </Box>
  );
};

export default SuccessPage;