import React, { useState } from 'react';
import { VStack, Text, Image, Badge, Button, HStack } from '@chakra-ui/react';
import { FiShoppingCart } from 'react-icons/fi';

const FoodItem = ({ item }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = () => {
    setQuantity(quantity + 1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <VStack
      p={4}
      borderWidth={1}
      borderRadius="md"
      bgColor="white"
      width="100%"
      cursor="pointer"
      _hover={{ boxShadow: 'md' }}
    >
      {/* Item Image and Name */}
      <HStack>
        <VStack align="start" flex="1">
          <Text fontSize="lg" fontWeight="bold">
            {item.name}
          </Text>
          <Text fontSize="sm" noOfLines={3} maxHeight="60px">
            {item.description}
          </Text>
        </VStack>
        <Image
          src={item.photo}
          alt={item.name}
          boxSize={['80px', '120px']}
          borderRadius="md"
        />
      </HStack>
      {/* Item Price, Type, and Add to Cart */}
      <Text fontSize="sm" color="gray.600">
        Price: ${item.price}
      </Text>
      <Badge colorScheme={item.type === 'veg' ? 'green' : 'red'}>
        {item.type === 'veg' ? '🌿 Veg' : '🍖 Non-Veg'}
      </Badge>
      <HStack spacing={2}>
        {quantity > 0 ? (
          <VStack>
            <Text fontSize="sm" color="gray.600">
              Quantity: {quantity}
            </Text>
            <HStack spacing={1}>
              <Button
                onClick={handleDecreaseQuantity}
                size="sm"
                colorScheme="teal"
              >
                -
              </Button>
              <Text>{quantity}</Text>
              <Button
                onClick={handleIncreaseQuantity}
                size="sm"
                colorScheme="teal"
              >
                +
              </Button>
            </HStack>
          </VStack>
        ) : (
          <Button
            onClick={handleAddToCart}
            leftIcon={<FiShoppingCart />}
            colorScheme="teal"
          >
            Add to Cart
          </Button>
        )}
      </HStack>
    </VStack>
  );
};

export default FoodItem;
