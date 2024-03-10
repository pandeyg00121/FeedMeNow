import React from 'react';
import {Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, FormControl, HStack, Heading, Input, VStack, useDisclosure} from "@chakra-ui/react"
import { Link } from 'react-router-dom';
import {RiDashboardFill, RiLogoutBoxLine, RiMenu5Fill} from "react-icons/ri";
import { FaSearch } from "react-icons/fa";

const LinkButton=({url="/",title="Home",onClose})=>(
  <Link onClick={onClose} to={url}>
             <Button variant={"ghost"}>{title}</Button>
            </Link>
)

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isAuthenticated=true;
    const user={
        role:"user"
    }
    const logoutHandler=()=>{
      console.log("logout");
      onClose();
  }

  return (
    <HStack p={4} justifyContent={"space-between"}>
      {/*Left Side*/}
      <Box>
      <Link to={"/"}>
      <Heading children="FeedMeNow" size={["sm","md"]} fontFamily={"cursive"} color={"yellow.500"}/>
      </Link>
      </Box>
      {/*Center*/}
      <HStack >
      <FormControl>
      <Input
        type="text"
        id="search"
        placeholder="Search for food..."
        sx={{"&::placeholder":{color:"black"}}}
        size={["sm","md"]}
        variant="filled"
        bg="rgba(245, 247, 248,0.8)"
        width={{ base: "full", md: "md" }}
        focusBorderColor='blue.700'
        _hover="none"
        _focus={{bg:"rgba(245, 247, 248,0.8)"}}
        textColor="black"
        borderRadius="lg"
      />
      </FormControl>
      <Link to="/search">
      <FaSearch size={23} color='white'/>
      </Link>
      </HStack>
      {/*Right Side*/}
      <Box>
      <Button onClick={onOpen} colorScheme='yellow' width={"12"} height={"12"} 
      zIndex={'overlay'} >
        <RiMenu5Fill/>
      </Button>
      <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
       <DrawerOverlay />
       <DrawerHeader/>
       <DrawerContent bg="rgba(0, 0, 0, 0.3)">
        <DrawerBody mt={5}>
            <VStack spacing={"8"} alignItems={"flex-start"}>
              <LinkButton onClose={onClose} url="/" title="Home"/>
              <HStack justifyContent={"space-evenly"} position={"absolute"} 
              bottom={"2rem"} width={"80%"}>
             {
                isAuthenticated?(<>
                    <VStack>
                        <HStack>
                           {user && user.role==="user" && (<Link onClick={onClose} to="/profile">
                            <Button variant={"ghost"} colorScheme='yellow'>
                                Profile
                            </Button>
                           </Link>)}
                            
                        </HStack>
                        {
                            user && user.role==="admin" && <Link onClick={onClose} to="/admin/dashboard">
                                <Button colorScheme='purple' variant={"ghost"}>
                                <RiDashboardFill style={{margin:"4px"}}/>
                                   Dashboard 
                                </Button>
                            </Link>
                        }
                        {
                            user && user.role==="restaurant" && <Link onClick={onClose} to="/restaurant/dashboard">
                                <Button colorScheme='purple' variant={"ghost"}>
                                <RiDashboardFill style={{margin:"4px"}}/>
                                   Dashboard 
                                </Button>
                            </Link>
                        }
                        <Button variant={"ghost"} onClick={logoutHandler}>
                                <RiLogoutBoxLine/>
                                Logout
                            </Button>
                    </VStack>
                </>):(<>
                    <Link onClick={onClose} to='/login'>
                        <Button colorScheme='yellow'>Login</Button>
                    </Link>
                    <p>OR</p>
                    <Link onClick={onClose} to='/register'>
                        <Button colorScheme='yellow'>Sign-Up</Button>
                    </Link>
                </>)
             }
              </HStack> 
            </VStack>
        </DrawerBody>
       </DrawerContent>
      </Drawer>
      </Box>
     </HStack>
  );
};

export default Navbar;



