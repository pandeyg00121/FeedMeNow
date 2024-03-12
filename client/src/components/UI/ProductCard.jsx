import { Box, Image, Flex, Text,Icon} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

function StarRating({ rating }) {
    const stars = [];
  
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Icon
          key={i}
          as={FaStar}
          color={i < Math.floor(rating) ? "yellow.400" : "gray.300"}
        />
      );
    }
  
    return <Box mt={1}>{stars}</Box>;
  }

function ProductCard({ product }) {
  
  return (
    <Box maxW="225px" maxH={"400px"} borderWidth="1px" borderRadius="lg" bgColor={"rgb(255,255,255)"} p={1}>
      <Image src={product.image} alt={product.name} height={"150px"} width={"full"} borderRadius={"lg"}/>

      <Box p="1" ml={"8px"} mt={"2px"}>
        <Box d="flex" alignItems="baseline">
          <Text color={"black"} fontWeight="semibold" fontSize="20px" mb="2">
            {product.name}
          </Text>
          </Box>
          <Box >
          <Text color="white" fontSize="12px" backgroundColor={product.type==="veg"?"green.300":"red.400"} width={product.type==="veg"?"30px":"55px"} textAlign={"center"} p={1}>
            {product.type}
          </Text>
          </Box>
        <Text color="gray.500" fontSize="sm" noOfLines={2} mt={2}>
          {product.description}
        </Text>

        <Flex alignItems="center" mt="1.5">
          <Text fontSize="md" fontWeight={"bold"} color={"black"}>{product.restaurant}</Text>
        </Flex>
        <Flex direction={"row"} gap={2}>
        <StarRating rating={product.rating}/>
        <Text color="black" fontWeight="bold" mt={1}>
            ({product.rating})
        </Text>
        </Flex>
      </Box>
    </Box>
  );
}

export default ProductCard;



