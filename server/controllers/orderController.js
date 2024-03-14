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

//User can view previous orders
exports.prevOrders=catchAsync(async(req,res,next)=>{
  const userId = req.user.id;

  const orders = await Order.find({ user: userId, status: 'Delivered' });

  res.status(200).json({
    status: 'success',
    data: {
      orders,
    },
  });

});

//User can view current orders
exports.currOrders=catchAsync(async(req,res,next)=>{
  const userId = req.user.id;

  const orders = await Order.find({ user: userId, status: { $ne: 'Delivered' } });

  res.status(200).json({
    status: 'success',
    data: {
      orders,
    },
  });

});

//Restaurant can view all previous orders
exports.resPrevOrders=catchAsync(async(req,res,next)=>{
  const restaurantId = req.restaurant.id; 

  const orders = await Order.find({ restaurant: restaurantId, status: 'Delivered' });

  res.status(200).json({
    status: 'success',
    data: {
      orders,
    },
  });
});

//Restaurant can view current pending orders
exports.resCurrOrders=catchAsync(async(req,res,next)=>{
  const restaurantId = req.restaurant.id; 

  const orders = await Order.find({ restaurant: restaurantId, status: { $ne: 'Delivered' } });

  res.status(200).json({
    status: 'success',
    data: {
      orders,
    },
  });
});

//Restaurant can change order status
exports.updateOrderStatus=catchAsync(async(req,res,next)=>{
  // const restaurantId = req.restaurant.id; 
  // const orderId = req.params.orderId;
  const { status,orderId } = req.body;

  // Check if the status is valid
  const validStatuses = ['Pending', 'Preparing', 'Out For Delivery' , 'Delivered'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  // Update the order status
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });

});