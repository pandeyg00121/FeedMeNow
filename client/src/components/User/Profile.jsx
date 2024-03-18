import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Spacer,
  Divider,
  Link as ChakraLink,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import {
  FaClipboardList,
  FaStar,
  FaHeart,
  FaEdit,
  FaCamera,
  FaKey,
  FaFirstOrder,
} from 'react-icons/fa'; // Import icons
import PreviousOrders from './PreviousOrdersUser';
import ReviewsPage from './Reviews';
import CurrentOrder from './CurrentOrderUser';
import { useGetUserQuery,useUpdatePasswordMutation,useUpdateProfileMutation } from '../../redux/api';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';

const SidebarLink = ({ to, children, icon }) => {
  const navigate = useNavigate();
  const isActive = window.location.pathname === to;

  return (
    <ChakraLink
      as={Link}
      to={to}
      display="flex"
      alignItems="center"
      p={2}
      borderRadius="md"
      _hover={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}
      backgroundColor={isActive ? 'rgba(255, 0, 0, 0.1)' : 'transparent'}
      color={isActive ? 'red.500' : 'inherit'}
      onClick={() => navigate(to)}
    >
      {icon && <Box as={icon} fontSize="lg" mr={2} />}
      {children}
    </ChakraLink>
  );
};

const Profile = () => {
  
  // State for drawer open/close
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // State for password change form
  const [changePassword, setChangePassword] = useState(false);
  const [currentPass,setCurrentPass]=useState("");
  const [newPass,setNewPass]=useState("");
  const [confirmPass,setConfirmPass]=useState("");
  const [currentUser,setCurrentUser] =useState({});
  const [username,setUsername]=useState("");
  const [address,setAddress]=useState("");
  const{data,isLoading}=useGetUserQuery("");
  const [updatePassword]=useUpdatePasswordMutation();
  const [updateProfile]=useUpdateProfileMutation();
  useEffect(()=>{
   if(!isLoading && data){
      setCurrentUser(data);
   }
  },[isLoading,data])

   console.log(currentUser);
  // Handle form submission
  const handleSubmit = async() => {
    const updatedUser={
      name:username,
      address:address
    }
    try {
      await updateProfile(updatedUser);
    } catch (error) {
      console.log(error);
    }
    setUsername("");
    setAddress("")
    setIsDrawerOpen(false);
    window.location.reload();
  };

  // Handle password change form submission
  const handlePasswordSubmit = async()=> {
    const pass={
      passwordCurrent:currentPass,
      password:newPass,
      passwordConfirm:confirmPass
    }
    try {
      await updatePassword(pass);
    } catch (error) {
      console.log(error);
    }
    
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    setChangePassword(false);
  };

  return (
    <>
    <Navbar/>
      <Flex justify="center" minHeight="100vh" bg="gray.100">
        <Box p={8} width="90%">
          {/* Profile Header */}
          <Flex align="center" mb={8} direction={{ base: 'column', md: 'row' }}>
            <Avatar size="xl" src={currentUser.profilePic} />
            <VStack
              ml={{ base: 0, md: 8 }}
              align="flex-start"
              mt={{ base: 4, md: 0 }}
            >
              <Heading fontSize={{ base: '2xl', md: '4xl' }}>
                Welcome Back, {currentUser.name}!
              </Heading>
              <Text color="gray.500" >
                Your favorite place for delicious food.
              </Text>
              <Button
                colorScheme="red"
                mt={4}
                leftIcon={<FaEdit />}
                onClick={() => setIsDrawerOpen(true)}
              >
                Edit Profile
              </Button>
              <Button
                colorScheme="red"
                mt={4}
                leftIcon={<FaKey />}
                onClick={() => setChangePassword(true)}
              >
                Change Password
              </Button>
            </VStack>
          </Flex>

          {/* Divider */}
          <Divider my={8} borderColor="black" />

          {/* Main Content */}
          <Flex>
            {/* Left Sidebar */}
            <VStack
              margin={1}
              border="1px solid"
              borderColor="gray.500"
              padding={2}
              borderRadius="lg"
              bg="white"
              boxShadow="md"
              minWidth="300px"
            >
              <Heading fontSize="xl" mb={4} mt={6}>
                Activities
              </Heading>
              <SidebarLink
                to="/user/profile/previous-orders"
                icon={FaClipboardList}
              >
                My Previous Orders
              </SidebarLink>
              <SidebarLink to="/user/profile/current-order" icon={FaFirstOrder}>
                Current Order
              </SidebarLink>
              <SidebarLink to="/user/profile/my-reviews" icon={FaStar}>
                My Reviews
              </SidebarLink>
            </VStack>

            {/* Right Content */}
            <Box flex="1" pl={8}>
              {/* Add your content here */}
              <Routes>
                <Route path="/current-order" element={<CurrentOrder />} />
                <Route path="/previous-orders" element={<PreviousOrders />} />
                <Route path="/my-reviews" element={<ReviewsPage />} />
              </Routes>
            </Box>
          </Flex>
        </Box>
      </Flex>

      {/* Drawer for editing profile */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        size="md" // Medium size drawer
        motionPreset="slideInRight"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Profile</DrawerHeader>

          <DrawerBody>
            <Flex mb={4} align="center">
              <Avatar size="xl" src={currentUser.profilePic} />
            </Flex> 
            <FormControl>
              <FormLabel>Username:</FormLabel>
              <Input onChange={(e)=>setUsername(e.target.value)} />
              <FormLabel mt={2}>Address:</FormLabel>
              <Input onChange={(e)=>setAddress(e.target.value)} />
              <Button onClick={handleSubmit} mt={5} colorScheme='green'>Save Changes</Button>
            </FormControl>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Drawer for changing password */}
      <Drawer
        isOpen={changePassword}
        placement="right"
        onClose={() => setChangePassword(false)}
        size="md" // Medium size drawer
        motionPreset="slideInRight"
      >
        <DrawerOverlay />
        <DrawerContent p={5}>
          <DrawerCloseButton />
          <DrawerHeader>Change Password</DrawerHeader>
           <FormControl>
            <FormLabel mt={2}>Current Password:</FormLabel>
            <Input width={"450px"}mt={2} onChange={(e)=>setCurrentPass(e.target.value)}/>
            <FormLabel mt={3}>New Password:</FormLabel>
            <Input width={"450px"}mt={2} onChange={(e)=>setNewPass(e.target.value)}/>
            <FormLabel mt={3}>Confirm New Password:</FormLabel>
            <Input width={"450px"}mt={2} onChange={(e)=>setConfirmPass(e.target.value)}/>
            <Button type='submit' mt={6} colorScheme='green' onClick={handlePasswordSubmit}>Submit</Button>
           </FormControl>
          <DrawerBody>
            
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Footer/>
    </>
  );
};

export default Profile;
