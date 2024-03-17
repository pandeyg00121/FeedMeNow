const Order = require("./../models/orderModel");
const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Restaurant = require("../models/restaurantModel");
const Food = require('./../models/foodModel')
// Add a review
exports.addReview = catchAsync(async (req, res, next) => {
  const { review, rating} = req.body;
  const orderId = req.params.id; 
  console.log(orderId);
  const userId = req.user.id;

  // Check if the user has already reviewed this order
  const existingReview = await Review.findOne({ user: userId, order: orderId });
  if (existingReview) {
    return next(new AppError('You have already reviewed this order', 400));
  }

  // Create the review
  const newReview = await Review.create({
    user: userId,
    review,
    rating,
    order: orderId,
  });
  console.log(newReview);
  const order = await Order.findById(orderId);
  const restaurant = await Restaurant.findById(order.restaurant);

  // Update the restaurant's reviews and ratingsAverage
  restaurant.reviews.push(newReview._id);
  restaurant.ratingsQuantity += 1;
  const f= ((restaurant.ratingsAverage * (restaurant.ratingsQuantity - 1)) + rating) / restaurant.ratingsQuantity;
  restaurant.ratingsAverage =f;
  
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

// Get all reviews of the logged-in user
exports.myReviews = catchAsync(async (req, res, next) => {

  const userId = req.user.id;

  const review = await Review.find({ user: userId }).populate('order');
  const populatedReviews = await Promise.all(review.map(async (item) => {
    const order = item.order;
    
    // Lookup for restaurant name
    const restaurant = await Restaurant.findById(order.restaurant);
    // Add restaurant name field
    order.restaurantName = restaurant ? restaurant.name : 'Unknown Restaurant';

    // Array to store promises for fetching food names
    const foodPromises = order.items.map(async (foodItem) => {
        const food = await Food.findById(foodItem.food);
        // Add food name field
        foodItem.foodName = food ? food.name : 'Unknown Food';
        return foodItem;
    });

    // Wait for all food name promises to resolve
    order.items = await Promise.all(foodPromises);

    return item;
}));


  res.status(200).send(populatedReviews);
});

//Restaurant can see their reviews on delivered orders
exports.resReviews= catchAsync(async(req,res,next)=>{
    const resId = req.restaurant.id; 

    // Finding orders associated with the restaurant
    const orders = await Order.find({ restaurant: resId });
  
    // Extracting order ids
    const orderIds = orders.map(order => order._id);
  
    // Finding reviews associated with the orders
    const reviews = await Review.find({ order: { $in: orderIds } }).populate('order');

    res.status(200).json({
      status: 'success',
      data: {
        reviews,
      },
    });
});

exports.getAllReviews = catchAsync(async(req,res,next) => {
  const review = await Review.find({});
  const populatedReviews = await Promise.all(review.map(async (item) => {
    const order = item.order;
    // Lookup for restaurant name
    const restaurant = await Restaurant.findById(order.restaurant);
    // Replace restaurant ID with name
    order.restaurant = restaurant ? restaurant.name : 'Unknown Restaurant';

    // Lookup for each food item's name
    const populatedItems = await Promise.all(order.items.map(async (foodItem) => {
        const food = await Food.findById(foodItem.food);
        // Replace food ID with name
        foodItem.food = food ? food.name : 'Unknown Food';
        return foodItem;
    }));
    // Replace items with populatedItems
    order.items = populatedItems;

    return item;
}));
  res.status(200).send(populatedReviews);
});
