import { Button, VStack } from '@chakra-ui/react'
import React from 'react'
import { RiAddCircleFill, RiDashboardFill, RiEyeFill} from 'react-icons/ri'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
    const location=useLocation();
  return (
    <VStack spacing={"8"} p={"16"} boxShadow={'-1px 0 10px rgba(255,0,0,0.5)'}>
      <LinkButton Icon={RiDashboardFill} text={"Dashboard"} url="dashboard" active={location.pathname==="/restaurant/dashboard"}/>
      <LinkButton Icon={RiEyeFill} text={"Manage Items"} url="manageitems" active={(location.pathname==="/restaurant/manageitems")||location.pathname==="/restaurant/additem"}/>
      <LinkButton Icon={RiAddCircleFill} text={"Manage Current Orders"} url="currentorders" active={location.pathname==="/restaurant/currentorders"}/>
      <LinkButton Icon={RiAddCircleFill} text={"View Previous Orders"} url="previousorders" active={location.pathname==="/restaurant/previousorders"}/>
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

