const Order = require("./../models/orderModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Cart = require("./../models/cartModel");

// Place an order
exports.placeOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId }).populate(
    "restaurants.restaurant",
    "name"
  );

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  // Create an order for each restaurant in the cart
  const orders = cart.restaurants.map(async (restaurant) => {
    const order = await Order.create({
      user: userId,
      restaurant: restaurant.restaurant,
      items: restaurant.items,
      rpice: restaurant.rPrice,
      status: "Pending",
    });

    return order;
  });

  // Wait for all orders to be created
  const createdOrders = await Promise.all(orders);

  // Clear the cart after placing orders
  cart.restaurants = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    status: "success",
    data: {
      orders: createdOrders,
    },
  });
});
