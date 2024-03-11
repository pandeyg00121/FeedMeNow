const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Order = require("./../models/orderModel");
const Cart = require("./../models/cartModel");

// Place an order
exports.placeOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Fetch the user's cart
  const cart = await Cart.findOne({ user: userId }).populate('restaurants.restaurant', 'name');

  if (!cart) {
    return res.status(404).json({ status: 'error', message: 'Cart not found' });
  }

  // Get the selected restaurant IDs from the request (replace this with your actual implementation)
  const selectedRestaurantIds = req.body.selectedRestaurantIds || [];

  // Filter the selected restaurants from the cart
  const selectedRestaurants = cart.restaurants.filter((r) => selectedRestaurantIds.includes(String(r.restaurant)));

  // Validate if there are selected restaurants
  if (selectedRestaurants.length === 0) {
    return res.status(400).json({ status: 'error', message: 'No restaurants selected for order' });
  }

  // Calculate total order price
  const totalOrderPrice = selectedRestaurants.reduce((total, restaurant) => {
    const restaurantTotal = restaurant.items.reduce((subtotal, item) => subtotal + item.price, 0);
    return total + restaurantTotal;
  }, 0);

  // Create the order
  const order = await Order.create({
    user: userId,
    restaurants: selectedRestaurants,
    totalPrice: totalOrderPrice,
  });

  // Remove the selected items from the cart
  selectedRestaurants.forEach((selectedRestaurant) => {
    const existingRestaurantIndex = cart.restaurants.findIndex((r) => r.restaurant.equals(selectedRestaurant.restaurant));
    if (existingRestaurantIndex !== -1) {
      cart.restaurants.splice(existingRestaurantIndex, 1);
    }
  });

  // Save the updated cart
  await cart.save();

  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
});
