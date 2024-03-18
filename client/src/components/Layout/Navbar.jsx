import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Input,
  VStack,
  useDisclosure,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../redux/features/slices/authUserApi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RiDashboardFill, RiLogoutBoxLine, RiMenu5Fill } from 'react-icons/ri';
import { FaSearch } from 'react-icons/fa';
import logo from '../../assets/logo.jfif';
import { logoutuserdata } from '../../redux/features/slices/authUserSlice';

const LinkButton = ({ url = '/', title = 'Home', onClose }) => (
  <Link onClick={onClose} to={url}>
    <Button
      variant={'ghost'}
      color={'yellow.600'}
      fontWeight={'bold'}
      size={'md'}
    >
      {title}
    </Button>
  </Link>
);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const isAuthenticated = true;
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const user = {
    _id: '123456890qwerty',
    name: 'Pranay Pandey',
    role: 'restaurant',
    profilePic:
      'https://media.licdn.com/dms/image/D4D03AQGM3TYJYte9bA/profile-displayphoto-shrink_800_800/0/1687941627773?e=1715817600&v=beta&t=59SDcTROZWoNY8O7S3hTWYqGdqvgUMjWpHB2i5HR95s',
  };
  const logoutHandler = async () => {
    try {
      await logout();
      dispatch(logoutuserdata());
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
 

  return (
    <HStack
      p={2}
      justifyContent={'space-between'}
      bgColor="rgba(0,0,0,0.6)"
      width="100%"
    >
      {/*Left Side*/}
      <Box>
        <Link to={'/'}>
          <Image
            src={logo}
            borderRadius="full"
            boxSize="60px"
            objectFit="cover"
          />
        </Link>
      </Box>
      {/*Right Side*/}
      <Stack direction="col">
        {user && user.role === 'user' && (
          <>
            <Link to={`user/${user._id}`}>
              <Image
                src={user.profilePic}
                borderRadius="full"
                boxSize="42px"
                objectFit="cover"
              />
            </Link>
            <Text
              children={`Hello! ${user.name.split(' ')[0]}`}
              fontSize={['medium', 'large']}
              mt={'10px'}
              fontFamily="sans-serif"
              fontWeight={'bold'}
            />
          </>
        )}
        <Button
          onClick={onOpen}
          colorScheme="yellow"
          width={'10'}
          height={'10'}
          zIndex={'overlay'}
        >
          <RiMenu5Fill />
        </Button>
        <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerHeader />
          <DrawerContent bg="rgba(0, 0, 0, 0.7)">
            <DrawerBody mt={5}>
              <VStack spacing={'8'} alignItems={'flex-start'}>
                <LinkButton onClose={onClose} url="/" title="Home" />
                <LinkButton onClose={onClose} url="/user/profile" title="My Profile" />
                <LinkButton onClose={onClose} url="/foods" title="All Foods" />
                <LinkButton onClose={onClose} url="/restaurants" title="All Restaurants" />
                <LinkButton onClose={onClose} url="/users/viewcart" title="My Cart" />
                <HStack
                  justifyContent={'space-evenly'}
                  position={'absolute'}
                  bottom={'2rem'}
                  width={'80%'}
                >
                  {isAuthenticated ? (
                    <>
                      <VStack>
                        <Button
                          variant={'ghost'}
                          onClick={logoutHandler}
                          color={'red.500'}
                          fontWeight={'bold'}
                          size={'md'}
                        >
                          <RiLogoutBoxLine />
                          Logout
                        </Button>
                      </VStack>
                    </>
                  ) : (
                    <>
                      <Link onClick={onClose} to="/login">
                        <Button colorScheme="yellow">Login</Button>
                      </Link>
                      <p>OR</p>
                      <Link onClick={onClose} to="/register">
                        <Button colorScheme="yellow">Sign-Up</Button>
                      </Link>
                    </>
                  )}
                </HStack>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Stack>
    </HStack>
  );
};

export default Navbar;
