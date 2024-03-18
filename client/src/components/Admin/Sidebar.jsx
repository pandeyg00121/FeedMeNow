import React from 'react';
import { Button, VStack } from '@chakra-ui/react';
import {
  RiAddCircleFill,
  RiDashboardFill,
  RiEyeFill,
  RiUser2Fill,
  RiRestaurantFill,
  RiLogoutBoxFill,
  RiAddFill,
  RiUserLocationFill,
  RiMapFill,
} from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../redux/features/slices/authUserApi';
import { logoutuserdata } from '../../redux/features/slices/authUserSlice';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
      await logout();
      dispatch(logoutuserdata());
      navigate('/');
      console.log('loggedout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <VStack spacing={8} p={16} boxShadow={'-3px 0 12px rgba(255, 199, 0,0.6)'}>
      <LinkButton
        Icon={RiDashboardFill}
        text={'Dashboard'}
        url="dashboard"
        active={location.pathname === '/admin/dashboard'}
      />
      <LinkButton
        Icon={RiUser2Fill}
        text={'Users'}
        url="users"
        active={location.pathname === '/admin/users'}
      />
      <LinkButton
        Icon={RiRestaurantFill}
        text={'Restaurants'}
        url="restaurants"
        active={location.pathname === '/admin/restaurants'}
      />
      <LinkButton
        Icon={RiAddFill}
        text={'Restaurants Request'}
        url="restaurants/request"
        active={location.pathname === '/admin/restaurants/request'}
      />
      <LinkButton
        Icon={RiMapFill}
        text={'UserMap'}
        url="usermap"
        active={location.pathname === '/admin/usermap'}
      />
      <Button
        variant={'ghost'}
        onClick={logoutHandler}
        color={'red.500'}
        fontWeight={'bold'}
        size={'md'}
      >
        <RiLogoutBoxFill />
        Logout
      </Button>
    </VStack>
  );
};

export default Sidebar;

function LinkButton({ url, Icon, text, active }) {
  return (
    <Link to={`/admin/${url}`}>
      <Button
        fontSize="larger"
        variant="ghost"
        colorScheme={active ? 'yellow' : ''}
        leftIcon={<Icon style={{ margin: '4px' }} />}
      >
        {text}
      </Button>
    </Link>
  );
}
