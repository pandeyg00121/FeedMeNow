const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Order = require("./../models/orderModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Cart = require("./../models/cartModel");
const User = require("./../models/userModel");
const Food = require("../models/foodModel");
const Restaurant = require("../models/restaurantModel");

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
  await Cart.deleteOne({ user: userId });

  res.status(201).json({
    status: "success",
    data: {
      orders: createdOrders,
    },
  });
});

//User can view previous orders
exports.prevOrders = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const orders = await Order.find({ user: userId, status: "Delivered" });
  const modifiedOrders = [];
  // Iterate through each order
  for (const order of orders) {
    // Fetch user details for the order
    const restaurant = await Restaurant.findById(order.restaurant);

    // Modified items array to store food details
    const modifiedItems = await Promise.all(
      order.items.map(async (item) => {
        // Fetch food details for the item
        const food = await Food.findById(item.food);

        // Return modified item details
        return {
          foodName: food.name,
          foodType: food.type,
          quantity: item.quantity,
          price: item.price,
        };
      })
    );
    const timestampString = order.createdAt;
    const formattedTimestamp = formatTimestamp(timestampString);
    // Modified order object
    const modifiedOrder = {
      _id: order._id,
      restaurantName: restaurant.name,
      items: modifiedItems,
      status: order.status,
      rPrice: order.rpice,
      createdAt: formattedTimestamp,
      paymentMode: order.payment,
    };

    // Add modified order to the array
    modifiedOrders.push(modifiedOrder);
  }

  // Send the modified orders to the restaurant
  res.status(200).send(modifiedOrders);
});

//User can view current orders
exports.currOrders = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const orders = await Order.find({
    user: userId,
    status: { $ne: "Delivered" },
  });
  const modifiedOrders = [];
  // Iterate through each order
  for (const order of orders) {
    // Fetch user details for the order
    const restaurant = await Restaurant.findById(order.restaurant);

    // Modified items array to store food details
    const modifiedItems = await Promise.all(
      order.items.map(async (item) => {
        // Fetch food details for the item
        const food = await Food.findById(item.food);

        // Return modified item details
        return {
          foodName: food.name,
          foodType: food.type,
          quantity: item.quantity,
          price: item.price,
        };
      })
    );
    const timestampString = order.createdAt;
    const formattedTimestamp = formatTimestamp(timestampString);
    // Modified order object
    const modifiedOrder = {
      _id: order._id,
      restaurantName: restaurant.name,
      items: modifiedItems,
      status: order.status,
      rPrice: order.rpice,
      createdAt: formattedTimestamp,
      paymentMode: order.payment,
    };

    // Add modified order to the array
    modifiedOrders.push(modifiedOrder);
  }

  // Send the modified orders to the restaurant
  res.status(200).send(modifiedOrders);
});

//Restaurant can view all previous orders
exports.resPrevOrders = catchAsync(async (req, res, next) => {
  const restaurantId = req.restaurant.id;

  const orders = await Order.find({
    restaurant: restaurantId,
    status: "Delivered",
  });

  const modifiedOrders = [];

  // Iterate through each order
  for (const order of orders) {
    // Fetch user details for the order
    const user = await User.findById(order.user);

    // Modified items array to store food details
    const modifiedItems = await Promise.all(
      order.items.map(async (item) => {
        // Fetch food details for the item
        const food = await Food.findById(item.food);

        // Return modified item details
        return {
          foodName: food.name,
          foodType: food.type,
          quantity: item.quantity,
          price: item.price,
        };
      })
    );

    const timestampString = order.createdAt;
    const formattedTimestamp = formatTimestamp(timestampString);

    // Modified order object
    const modifiedOrder = {
      _id: order._id,
      userName: user.name,
      items: modifiedItems,
      status: order.status,
      rPrice: order.rpice,
      createdAt: formattedTimestamp,
      paymentMode: order.payment,
    };

    // Add modified order to the array
    modifiedOrders.push(modifiedOrder);
  }

  // Send the modified orders to the restaurant
  res.status(200).send(modifiedOrders);
});

//Restaurant can view current pending orders
exports.resCurrOrders = catchAsync(async (req, res, next) => {
  const restaurantId = req.restaurant.id;

  const orders = await Order.find({
    restaurant: restaurantId,
    status: { $ne: "Delivered" },
  });

  const modifiedOrders = [];

  // Iterate through each order
  for (const order of orders) {
    // Fetch user details for the order
    const user = await User.findById(order.user);

    // Modified items array to store food details
    const modifiedItems = await Promise.all(
      order.items.map(async (item) => {
        // Fetch food details for the item
        const food = await Food.findById(item.food);

        // Return modified item details
        return {
          foodName: food.name,
          foodType: food.type,
          quantity: item.quantity,
          price: item.price,
        };
      })
    );
    const timestampString = order.createdAt;
    const formattedTimestamp = formatTimestamp(timestampString);
    // Modified order object
    const modifiedOrder = {
      _id: order._id,
      userName: user.name,
      items: modifiedItems,
      status: order.status,
      rPrice: order.rpice,
      createdAt: formattedTimestamp,
      paymentMode: order.payment,
    };

    // Add modified order to the array
    modifiedOrders.push(modifiedOrder);
  }

  // Send the modified orders to the restaurant
  res.status(200).send(modifiedOrders);
});

//Restaurant can change order status
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  // const restaurantId = req.restaurant.id;
  const orderId = req.params.id;
  const status = req.body.status;
  console.log(status);
  // Check if the status is valid
  const validStatuses = [
    "Pending",
    "Preparing",
    "Out For Delivery",
    "Delivered",
  ];
  // if (!validStatuses.includes(status)) {
  //   return next(new AppError('Invalid status', 400));
  // }

  // Update the order status
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});


function formatTimestamp(timestampString) {
  // Convert timestamp string to Date object
  const timestamp = new Date(timestampString);

  // Extract date components
  const year = timestamp.getFullYear();
  const month = (timestamp.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
  const day = timestamp.getDate().toString().padStart(2, '0');

  // Extract time components
  const hours = timestamp.getHours().toString().padStart(2, '0');
  const minutes = timestamp.getMinutes().toString().padStart(2, '0');
  const seconds = timestamp.getSeconds().toString().padStart(2, '0');

  // Format the timestamp
  const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedTimestamp;
}

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId })
  const totalPrice = cart.totalPrice;
  // // Find the user's cart
  // const array = Object.entries(await Cart.findOne({ user: userId }));
  // console.log(array);
  // const line 
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Cart checkout Success",
            // Add more product data as needed
          },
          unit_amount: Math.round(totalPrice * 100), // Amount in paise
        },
        quantity: 1, // Assuming quantity is 1 for now
      },
    ],
    mode: "payment",
    success_url: "http://localhost:5173/paymentsuccess",
    cancel_url: "http://localhost:5173/paymentfailure",
  });
  // 3) Create session as response
  res.status(200).json({
    id:session.id
  });
});