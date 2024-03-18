import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Image,
  Divider,
  Tooltip,
  useToast,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import {
  setCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
} from '../../redux/features/slices/CartSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import arr from '../../assets/arrow-icon.svg';
import { FiShoppingCart } from 'react-icons/fi';
import img from '../../assets/uu.jpg';
import img1 from '../../assets/OIG4.jpeg';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { useGetRestaurantOneQuery } from '../../redux/api';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const arrowIcon = new L.Icon({
  iconUrl: arr,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const MenuPage = () => {
  const { slug } = useParams();
  const { isLoading, isError, isSuccess, data, error } =
    useGetRestaurantOneQuery(slug);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState([]);

  useEffect(() => {
    console.log('isLoading:', isLoading);
    console.log('isError:', isError);
    console.log('isSuccess:', isSuccess);
    console.log('error:', error);
  }, [isLoading, isError, isSuccess, error]);

  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      console.log('Data:', data);
      setRestaurantInfo(data);
    }
  }, [isLoading, isSuccess, data]);

  useEffect(() => {
    if (isSuccess) {
      setIsMapLoaded(true);
    }
  }, [isSuccess]);

  const [filter, setFilter] = useState('all');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const scrollToCategory = category => {
    const headingElement = document.getElementById(category.toLowerCase());
    if (headingElement) {
      headingElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      onClose();
    }
  };
  const filteredItems =
    filter === 'all'
      ? restaurantInfo?.foods || [] // Use empty array as fallback if restaurantInfo is undefined
      : restaurantInfo?.foods?.filter(item => {
          if (filter === 'veg') {
            return item.type === 'veg';
          } else {
            return item.type === 'non-veg';
          }
        }) || []; // Use empty array as fallback if restaurantInfo or restaurantInfo.foods is undefined
  console.log(filteredItems);
  const menu = restaurantInfo?.foods || [];
  const categories = [...new Set(menu.map(item => item.category))];
  const allCategories = categories.filter(category =>
    filteredItems.some(item => item.category === category)
  );

  const handleFilterChange = newFilter => {
    setFilter(newFilter);
    toast({
      title: `Showing ${
        newFilter === 'all' ? 'All' : newFilter.toUpperCase()
      } items`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const [cart, setCart] = useState({});
  console.log(cart);
  const handleAddToCart = itemName => {
    const updatedCart = { ...cart };
    updatedCart[itemName] = { quantity: 1 };
    setCart(updatedCart);

    toast({
      title: `${itemName} added to cart`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleIncreaseQuantity = itemName => {
    const updatedCart = { ...cart };

    if (updatedCart[itemName]) {
      updatedCart[itemName].quantity += 1;
      setCart(updatedCart);
    }
  };

  const handleDecreaseQuantity = itemName => {
    const updatedCart = { ...cart };

    if (updatedCart[itemName] && updatedCart[itemName].quantity > 1) {
      updatedCart[itemName].quantity -= 1;
      setCart(updatedCart);
    } else {
      // Remove the item from the cart if the quantity is 1 or less
      delete updatedCart[itemName];
      setCart(updatedCart);
    }
  };

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = item => {
    setSelectedItem(item);
  };

  const handleCloseDescription = () => {
    setSelectedItem(null);
  };

  return (
    <Box p={4} bgColor="lightblue" minH="100vh">
      {/* Restaurant Images Slider */}
      <HStack width="100%" mt={4} rounded="md" overflow="hidden">
        <Image
          border="2px solid black"
          src={img}
          height="400px"
          width="40%"
          borderRadius="md"
          height="500px"
        />
        <VStack borderRight="2px solid black" padding={2} width="20%">
          <Image
            border="2px solid black"
            src={img}
            height="250px"
            width="100%"
            borderRadius="md"
          />
          <Image
            border="2px solid black"
            src={img}
            height="250px"
            width="100%"
            borderRadius="md"
          />
        </VStack>
        <VStack></VStack>
        <Box height={['200px', '300px', '400px']} width="40%">
          <Text mt={-20} align="center" fontWeight="bold" fontSize="60px">
            Map
          </Text>

          {isMapLoaded && (
            <MapContainer
              mt={4}
              center={[
                restaurantInfo.location.lat,
                restaurantInfo.location.lng,
              ]}
              zoom={15}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Marker for restaurant location */}
              <Marker
                position={[
                  restaurantInfo.location.lat,
                  restaurantInfo.location.lng,
                ]}
                icon={arrowIcon}
              >
                <Popup>Your Location</Popup>
              </Marker>
            </MapContainer>
          )}
        </Box>
      </HStack>
      {/* Map */}

      <Divider mt={4} borderColor="teal.500" />
      <VStack spacing={4} align="start" maxW="90%" mx="auto">
        {/* Restaurant Info */}
        <HStack justifyContent="space-between" w="100%">
          <VStack align="start" flex="1">
            <Heading mt={6} color="teal.500">
              {restaurantInfo.name}
            </Heading>
            <Text fontSize="sm" color="gray.600">
              {restaurantInfo.address}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {restaurantInfo.distance} away
            </Text>
          </VStack>
          <VStack align="end">
            <Text fontSize="lg" color="teal.500">
              Rating:⭐ {restaurantInfo.rating}
            </Text>
          </VStack>
        </HStack>
        <Divider borderColor="teal.500" />
        {/* Menu Filtering */}
        <HStack justifyContent="space-between" w="100%">
          <Text fontSize="xl" color="teal.500">
            Menu
          </Text>
          <HStack spacing={2}>
            <Tooltip label="Show All" hasArrow bg="teal.500">
              <Button
                onClick={() => handleFilterChange('all')}
                variant={filter === 'all' ? 'solid' : 'outline'}
                colorScheme="teal"
              >
                All
              </Button>
            </Tooltip>
            <Tooltip label="Show Veg Only" hasArrow bg="teal.500">
              <Button
                onClick={() => handleFilterChange('veg')}
                variant={filter === 'veg' ? 'solid' : 'outline'}
                colorScheme="teal"
              >
                Veg
              </Button>
            </Tooltip>
            <Tooltip label="Show Non-Veg Only" hasArrow bg="teal.500">
              <Button
                onClick={() => handleFilterChange('non-veg')}
                variant={filter === 'non-veg' ? 'solid' : 'outline'}
                colorScheme="teal"
              >
                Non-Veg
              </Button>
            </Tooltip>
          </HStack>
        </HStack>
        {/* Menu Categories */}
        {allCategories.map(category => (
          <Box
            key={category}
            mt={4}
            width="100%"
            id={category.toLowerCase()}
            p={4}
            rounded="md"
            bg="rgba(0,0,0,0.8)"
            boxShadow="md"
          >
            <Text fontSize="2xl" fontWeight="bold" mb={2} color="teal.500">
              {category}
            </Text>
            <SimpleGrid columns={[1, 2, 3]} spacing={4}>
              {filteredItems
                .filter(item => item.category === category)
                .map((item, index) => (
                  <Box
                    key={index}
                    p={4}
                    borderWidth={1}
                    borderRadius="md"
                    bgColor="white"
                    width="100%"
                    cursor="pointer"
                    _hover={{
                      boxShadow: 'md',
                    }}
                  >
                    <VStack spacing={4} align="start">
                      {/* Item Image and Name */}
                      <HStack>
                        <VStack align="start" flex="1">
                          <Text fontSize="lg" fontWeight="bold">
                            {item.name}
                          </Text>
                          <Text
                            onClick={() => handleItemClick(item)}
                            fontSize="sm"
                            noOfLines={3}
                            maxHeight="60px"
                          >
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
                      <Badge
                        colorScheme={item.type === 'veg' ? 'green' : 'red'}
                      >
                        {item.type === 'veg' ? '🌿 Veg' : '🍖 Non-Veg'}
                      </Badge>
                      <HStack spacing={2}>
                        {cart[item.name] ? (
                          <VStack>
                            <Text fontSize="sm" color="gray.600">
                              Quantity: {cart[item.name].quantity}
                            </Text>
                            <HStack spacing={1}>
                              <Button
                                onClick={() =>
                                  handleDecreaseQuantity(item.name)
                                }
                                size="sm"
                                colorScheme="teal"
                              >
                                -
                              </Button>
                              <Text>{cart[item.name].quantity}</Text>
                              <Button
                                onClick={() =>
                                  handleIncreaseQuantity(item.name)
                                }
                                size="sm"
                                colorScheme="teal"
                              >
                                +
                              </Button>
                            </HStack>
                          </VStack>
                        ) : (
                          <Button
                            onClick={() => handleAddToCart(item.name)}
                            leftIcon={<FiShoppingCart />}
                            colorScheme="teal"
                          >
                            Add to Cart
                          </Button>
                        )}
                      </HStack>
                    </VStack>
                  </Box>
                ))}
            </SimpleGrid>
          </Box>
        ))}
        {/* Browse Menu Button */}
        <HStack spacing={2} position="fixed" bottom="4" right="4">
          <Tooltip label="Browse Menu" hasArrow bg="teal.500">
            <Button onClick={onOpen} colorScheme="teal">
              Browse Menu
            </Button>
          </Tooltip>
        </HStack>

        {/* Modal for displaying full food description */}
        <Modal
          isOpen={!!selectedItem}
          onClose={handleCloseDescription}
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedItem?.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize="lg" fontWeight="bold" color="teal.500">
                Description:
              </Text>
              <Text fontSize="md">{selectedItem?.description}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
        {/* Modal for browsing menu categories */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="teal.500">Browse Menu</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="start">
                {allCategories.map(category => (
                  <HStack
                    key={category}
                    justifyContent="space-between"
                    w="100%"
                    _hover={{
                      bg: 'gray.100',
                    }}
                    p={2}
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => scrollToCategory(category)}
                  >
                    <Text fontSize="xl">{category}</Text>
                    <Badge>
                      {
                        filteredItems.filter(item => item.category === category)
                          .length
                      }
                    </Badge>
                  </HStack>
                ))}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default MenuPage;
