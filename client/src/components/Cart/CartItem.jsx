import React, { useState } from 'react';
import {
  VStack,
  Text,
  Button,
  HStack,
  Box,
  Spacer,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaTrashAlt } from 'react-icons/fa';
import {
  removeFromCart,
  updateQuantity,
  setCartItems,
} from '../../redux/features/slices/CartSlice';
import { useDispatch } from 'react-redux';
import { useUpdatefoodItemMutation } from '../../redux/api';
const CartItem = ({ id, name, price, quantity, initialprice }) => {
  const dispatch = useDispatch();
  const [isDeleted, setIsDeleted] = useState(false); // State to control item visibility
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [updateitem, { isLoadingupdate, isErrorupdate }] =
    useUpdatefoodItemMutation();
  const handleMinusClick = async () => {
    try {
      if (localQuantity > 1) {
        const res = await updateitem({ foodId: id, action: '-' }).unwrap();
        dispatch(updateQuantity({ foodId: id, quantity: localQuantity - 1 }));
        setLocalQuantity(prevQuantity => prevQuantity - 1);
      } else {
        setIsDeleted(true); // Set isDeleted to true to hide the item
        dispatch(removeFromCart({ foodId: id }));
      }
      window.location.reload();
    } catch (err) {
      console.error(err?.data?.message || err.error);
    }
  };

  const handlePlusClick = async () => {
    try {
      const res = await updateitem({ foodId: id, action: '+' }).unwrap();
      dispatch(updateQuantity({ foodId: id, quantity: localQuantity + 1 }));
      setLocalQuantity(prevQuantity => prevQuantity + 1);
    } catch (err) {
      console.error(err?.data?.message || err.error);
    }
    window.location.reload();
  };
  console.log(id);

  // Render null if the item is deleted
  if (isDeleted) {
    return null;
  }

  return (
    <Box
      p="4"
      borderWidth="1px"
      borderRadius="lg"
      shadow="md"
      width="100%"
      bgColor={'white'}
      transition="background-color 0.3s"
      _hover={{ bgColor: 'grey.100' }}
    >
      <VStack align="start" spacing="2">
        <HStack justify="space-between" w="100%">
          <Text fontSize="lg" fontWeight="bold" color="teal.500">
            {name}
          </Text>
          <Text color="gray.600">₹{initialprice}</Text>
        </HStack>
        <HStack spacing="2" w="100%">
          <Button
            onClick={handleMinusClick}
            disabled={localQuantity <= 1}
            colorScheme="teal"
            variant="outline"
          >
            -
          </Button>
          <Text fontSize="lg" fontWeight="bold" color="teal.500">
            {localQuantity}
          </Text>
          <Button
            onClick={handlePlusClick}
            colorScheme="teal"
            variant="outline"
          >
            +
          </Button>
          <Spacer />
        </HStack>
      </VStack>
    </Box>
  );
};

export default CartItem;
