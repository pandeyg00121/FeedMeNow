import { Box, HStack, Heading, Stack, VStack,Text } from '@chakra-ui/react'
import {Link} from "react-router-dom";
import {DiGithub} from "react-icons/di"
import {TiSocialInstagramCircular} from "react-icons/ti"

const Footer = () => {
  return (
    <Box padding={'5'} bg="rgba(211,211,211,0.92)" minH={'25vh'}>
      <HStack direction={["column","row"]}>
      <VStack alignItems={["center","flex-start"]} width={"full"}>
       <Heading children="All Rights Reserved ©" color={"black"} size={"md"}/>
       <Heading children="@DEVIOLA" fontFamily={"body"} size={"xs"} color={"black"}/>
      </VStack>
      <VStack alignItems={["center","flex-start"]} width={"full"}>
        <Heading children={"About Us"} color={"black"} size={"md"}/>
        <Link to="/aboutus">
        <Text children={"Who We Are"} color={"black"} _hover={{ color: "blue.600"}}
      cursor="pointer"/>
        </Link>
        <Link to="/contactus">
        <Text children={"Contact Us"} color={"black"} _hover={{ color: "blue.600"}}
      cursor="pointer"/>
        </Link>
      </VStack>
      <VStack alignItems={["center","flex-end"]} width={"full"}>
        <Heading children={"Social"} color={"black"} size={"md"}/>
        <HStack>
        <a href="https://github.com/pandeyg00121/FeedMeNow" target='_blank'>
        <DiGithub color='black' size={"30px"}/>
        </a>
        <a>
         <TiSocialInstagramCircular color='black' size={"25px"}/>
        </a>
        </HStack>
      </VStack>
      </HStack>
    </Box>
  )
}

export default Footer