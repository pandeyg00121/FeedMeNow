import React, { useState } from 'react';
import { VStack, HStack, Checkbox, Text } from '@chakra-ui/react';
import CartItem from './CartItem';

const RestaurantCart = ({
  restaurant,
  items,
  onQuantityChange,
  onRemoveItem,
  onCheckboxChange,
}) => {
  return (
    <VStack
      spacing="4"
      align="start"
      borderWidth="1px"
      borderRadius="lg"
      p="4"
      m="2"
      width="100%"
      bgColor="white"
      boxShadow="md"
    >
      <HStack justify="space-between" w="100%">
        <Text fontWeight="bold" fontSize="lg" color="teal.500">
          {restaurant}
        </Text>
      </HStack>
      {items.map(item => (
        <CartItem
          rest={restaurant}
          initialprice={item.price}
          key={item.id}
          onRemoveItem={() => onRemoveItem(item.id)}
          {...item}
        />
      ))}
    </VStack>
  );
};

export default RestaurantCart;
