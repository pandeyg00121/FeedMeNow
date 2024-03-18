import { Button, VStack } from '@chakra-ui/react'
import React from 'react'
import { RiAddCircleFill, RiDashboardFill, RiEyeFill, RiLogoutBoxFill} from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../../../redux/features/slices/authRestaurantApi'
import { logoutrestaurantdata } from '../../../redux/features/slices/authRestaurantSlice'

const Sidebar = () => {
    const location=useLocation();
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
      await logout();
      dispatch(logoutrestaurantdata());
      navigate('/restaurants/login');
      console.log('loggedout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <VStack spacing={"8"} p={"16"} boxShadow={'-1px 0 10px rgba(255,0,0,0.5)'}>
      <LinkButton Icon={RiDashboardFill} text={"Dashboard"} url="dashboard" active={location.pathname==="/restaurant/dashboard"}/>
      <LinkButton Icon={RiEyeFill} text={"Manage Items"} url="manageitems" active={(location.pathname==="/restaurant/manageitems")||location.pathname==="/restaurant/additem"}/>
      <LinkButton Icon={RiAddCircleFill} text={"Manage Current Orders"} url="currentorders" active={location.pathname==="/restaurant/currentorders"}/>
      <LinkButton Icon={RiAddCircleFill} text={"View Previous Orders"} url="previousorders" active={location.pathname==="/restaurant/previousorders"}/>
      <Button variant={"ghost"} colorScheme='red' fontSize={"larger"} onClick={logoutHandler}><RiLogoutBoxFill/> Logout</Button>
      </VStack>
  )
}

export default Sidebar;

function LinkButton({url,Icon,text,active}){
    return (
        <Link to={`/restaurant/${url}`}>
        <Button fontSize={"larger"} variant={"ghost"} colorScheme={active?'red':'white'}>
           <Icon style={{margin:'4px'}}/> 
           {text}
        </Button>
      </Link>
    )
}

