import React from 'react';
import {Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, FormControl, HStack,Input, VStack, useDisclosure,Image,Stack,Text} from "@chakra-ui/react"
import { Link } from 'react-router-dom';
import {RiDashboardFill, RiLogoutBoxLine, RiMenu5Fill} from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import logo from "../../assets/logo.jfif"

const LinkButton=({url="/",title="Home",onClose})=>(
  <Link onClick={onClose} to={url}>
             <Button variant={"ghost"}>{title}</Button>
            </Link>
)

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isAuthenticated=true;
    const user={
        _id:"123456890qwerty",
        name:"Pranay Pandey",
        role:"user",
        profilePic:"https://media.licdn.com/dms/image/D4D03AQGM3TYJYte9bA/profile-displayphoto-shrink_800_800/0/1687941627773?e=1715817600&v=beta&t=59SDcTROZWoNY8O7S3hTWYqGdqvgUMjWpHB2i5HR95s"
    }
    const logoutHandler=()=>{
      console.log("logout");
      onClose();
  }

  return (
    <HStack p={2} justifyContent={"space-between"} bgColor="rgba(0,0,0,0.6)">
      {/*Left Side*/}
      <Box>
      <Link to={"/"}>
      <Image src={logo} borderRadius="full" boxSize="60px" objectFit="cover"/>
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
      <Stack direction="col">
      {
        user && user.role==='user' && (<>
          <Link to={`user/${user._id}`}>
          <Image src={user.profilePic} borderRadius="full" boxSize="42px" objectFit="cover"/>
          </Link>
          <Text children={`Hello! ${user.name.split(' ')[0]}`} fontSize={["medium","large"]} mt={"10px"} fontFamily="sans-serif" fontWeight={"bold"}/>
          </>
        )
      }
      <Button onClick={onOpen} colorScheme='yellow' width={"10"} height={"10"} 
      zIndex={'overlay'} >
        <RiMenu5Fill/>
      </Button>
      <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
       <DrawerOverlay />
       <DrawerHeader/>
       <DrawerContent bg="rgba(0, 0, 0, 0.7)">
        <DrawerBody mt={5}>
            <VStack spacing={"8"} alignItems={"flex-start"}>
              <LinkButton onClose={onClose} url="/" title="Home"/>
              <HStack justifyContent={"space-evenly"} position={"absolute"} 
              bottom={"2rem"} width={"80%"}>
             {
                isAuthenticated?(<>
                    <VStack>
                        
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
      </Stack>
     </HStack>
  );
};

export default Navbar;



