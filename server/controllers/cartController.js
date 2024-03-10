const Restaurant = require("./../models/restaurantModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Food= require("./../models/foodModel");
const Cart = require("./../models/cartModel");

// Get user's cart details
exports.getCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate('restaurants.restaurant', 'name');

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

// Add item to the cart
exports.addItemToCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { restaurantId, foodId, quantity } = req.body;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  // Check if the restaurant is already in the cart
  const existingRestaurantIndex = cart.restaurants.findIndex((r) => r.restaurant.equals(restaurantId));

  if (existingRestaurantIndex === -1) {
    // If the restaurant is not in the cart, add it
    cart.restaurants.push({
      restaurant: restaurantId,
      items: [{ food: foodId, quantity }],
    });
  } else {
    // If the restaurant is already in the cart, checking if the food item is in the restaurant
    const existingFoodIndex = cart.restaurants[existingRestaurantIndex].items.findIndex((item) => item.food.equals(foodId));

    if (existingFoodIndex === -1) {
      // If the food item is not in the restaurant, add it
      cart.restaurants[existingRestaurantIndex].items.push({ food: foodId, quantity });
    } else {
      // If the food item is already in the restaurant, update the quantity
      cart.restaurants[existingRestaurantIndex].items[existingFoodIndex].quantity += quantity;
    }
  }

  await cart.save();

  res.status(201).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

// Remove item from the cart
exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { restaurantId, foodId } = req.params;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  // Check if the restaurant is in the cart
  const existingRestaurantIndex = cart.restaurants.findIndex((r) => r.restaurant.equals(restaurantId));

  if (existingRestaurantIndex === -1) {
    return res.status(404).json({ message: 'Restaurant not found in the cart' });
  }

  // Check if the food item is in the restaurant
  const existingFoodIndex = cart.restaurants[existingRestaurantIndex].items.findIndex((item) => item.food.equals(foodId));

  if (existingFoodIndex === -1) {
    return res.status(404).json({ message: 'Food item not found in the restaurant' });
  }

  // Remove the food item from the restaurant
  cart.restaurants[existingRestaurantIndex].items.splice(existingFoodIndex, 1);

  // If the restaurant is now empty, remove it from the cart
  if (cart.restaurants[existingRestaurantIndex].items.length === 0) {
    cart.restaurants.splice(existingRestaurantIndex, 1);
  }

  await cart.save();

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

// Update item quantity in the cart
exports.updateCartItemQuantity = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { restaurantId, foodId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  // Check if the restaurant is in the cart
  const existingRestaurantIndex = cart.restaurants.findIndex((r) => r.restaurant.equals(restaurantId));

  if (existingRestaurantIndex === -1) {
    return res.status(404).json({ message: 'Restaurant not found in the cart' });
  }

  // Check if the food item is in the restaurant
  const existingFoodIndex = cart.restaurants[existingRestaurantIndex].items.findIndex((item) => item.food.equals(foodId));

  if (existingRestaurantIndex === -1) {
    // If the restaurant is not in the cart, add it
    cart.restaurants.push({
      restaurant: restaurantId,
      items: [{ food: foodId, quantity }],
    });
  } else {
    // If the restaurant is already in the cart, check if the food item is in the restaurant
    const existingFoodIndex = cart.restaurants[existingRestaurantIndex].items.findIndex((item) => item.food.equals(foodId));
  
    if (existingFoodIndex === -1) {
      // If the food item is not in the restaurant, add it
      cart.restaurants[existingRestaurantIndex].items.push({ food: foodId, quantity });
    } else {
      // If the food item is already in the restaurant, update the quantity
      cart.restaurants[existingRestaurantIndex].items[existingFoodIndex].quantity += quantity;
    }
  }

});
