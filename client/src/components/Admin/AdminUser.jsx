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
import {useGetAllUsersQuery,useUpdateUserStatusMutation,useDeleteUserMutation} from "../../redux/api"

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
  const toast = useToast();
  const {data,isLoading}=useGetAllUsersQuery("");
  const [deleteUserMutation]=useDeleteUserMutation();
  console.log(data);

  useEffect(() => {
    if(!isLoading && data){
      setUsers(data);
    }
  }, [isLoading,data]);

  const deleteUser = async (userId) => {
    try {
      await deleteUserMutation(userId);
      const updatedUsers = users.filter((user) => user._id !== userId);
    setUsers(updatedUsers);
    } catch (error) {
      console.log(error);
    }

    toast({
      title: 'User Deleted',
      description: `User with ID ${userId} has been deleted.`,
      status: 'success',
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

        {isLoading ? (
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
                <Row key={user._id} user={user} deleteUser={deleteUser}/>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Sidebar />
    </Grid>
  );
};

function Row({user,deleteUser}){
  const [status, setStatus] = useState(user.active);
  const [updateUserStatus] = useUpdateUserStatusMutation();

  const handleStatusChange = async () => {
    const newStatus=!status;
    try {
    console.log(newStatus);
    await updateUserStatus({userId:user._id,newActive:newStatus});
    setStatus(newStatus);
    } catch (error) {
      console.log(error);
    }
    
  };
  const handleDelete=()=>{
    deleteUser(user._id);
}

  return(
    <Tr key={user._id}>
                  <Td>{user._id}</Td>
                  <Td>
                    <Avatar
                      size="md"
                      name={user.name}
                      src={user.profilePic}
                    />
                  </Td>
                  <Td>{user.name}</Td>
                  <Td>{user.location.address}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.gender}</Td>
                  <Td>
                    <Switch
                      colorScheme="teal"
                      isChecked={user.active}
                      onChange={(e)=>handleStatusChange()}
                    />
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={user.active ? 'green' : 'red'}
                      variant="solid"
                      >
                      {user.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      onClick={() => handleDelete()}
                    />
                  </Td>
                </Tr>
  )
}

export default AdminUsersPage;
