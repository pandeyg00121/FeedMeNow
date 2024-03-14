import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  IconButton,
  Spinner,
  Switch,
  useToast,
  Grid,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import Sidebar from './Sidebar';

// Simulated user data
const usersData = [
  {
    id: 1,
    profilePic: 'https://placekitten.com/50/50', // Example profile picture URL
    username: 'john_doe',
    location: 'City, Country',
    email: 'john@example.com',
    gender: 'Male',
    isActive: true,
  },
  {
    id: 2,
    profilePic: 'https://placekitten.com/50/51', // Example profile picture URL
    username: 'jane_smith',
    location: 'City, Country',
    email: 'jane@example.com',
    gender: 'Female',
    isActive: false,
  },
  // Add more user data as needed
];

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Simulate fetching user data from an API or database
    // In a real-world scenario, you would fetch this data from your server
    // For demonstration purposes, using a timeout to simulate an asynchronous operation
    const fetchData = async () => {
      try {
        // Simulating an asynchronous data fetch
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = userId => {
    // In a real-world scenario, you would send a request to your backend to delete the user
    // For demonstration purposes, simply updating the state here
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

    toast({
      title: 'User Deleted',
      description: `User with ID ${userId} has been deleted.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleStatusChange = userId => {
    // In a real-world scenario, you would send a request to your backend to update the user's status
    // For demonstration purposes, simply updating the state here
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );

    toast({
      title: 'Status Updated',
      description: `Status for User with ID ${userId} has been updated.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Grid templateColumns="1fr auto" gap="4" height="100vh">
      <Box
        p="4"
        borderWidth="2px"
        borderColor="gold"
        borderRadius="md"
        width="100%"
        overflow="auto"
      >
        <Heading mb="4" textAlign="center" fontSize="2xl">
          Admin Users Page
        </Heading>

        {loading ? (
          <Spinner size="lg" color="teal.500" />
        ) : (
          <Table variant="simple" mt="4" fontSize="lg" width="100%">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Profile Pic</Th>
                <Th>Username</Th>
                <Th>Location</Th>
                <Th>Email</Th>
                <Th>Gender</Th>
                <Th>Change Status</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>
                    <Avatar
                      size="md"
                      name={user.username}
                      src={user.profilePic}
                    />
                  </Td>
                  <Td>{user.username}</Td>
                  <Td>{user.location}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.gender}</Td>
                  <Td>
                    <Switch
                      colorScheme="teal"
                      isChecked={user.isActive}
                      onChange={() => handleStatusChange(user.id)}
                    />
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={user.isActive ? 'green' : 'red'}
                      variant="solid"
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      onClick={() => handleDeleteUser(user.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Sidebar />
    </Grid>
  );
};

export default AdminUsersPage;
