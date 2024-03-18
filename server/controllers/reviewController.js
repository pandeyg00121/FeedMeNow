const Order = require("./../models/orderModel");
const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Food=require("./../models/foodModel")
const Restaurant=require("./../models/restaurantModel")
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
  // console.log(newReview);
  const order = await Order.findById(orderId);
  const restaurant = await Restaurant.findById(order.restaurant);

  // Update the restaurant's reviews and ratingsAverage
  restaurant.reviews.push(newReview._id);
  const g= (restaurant.ratingsAverage * restaurant.ratingsQuantity) + rating;
  restaurant.ratingsQuantity += 1;
  const f= g / restaurant.ratingsQuantity;
  restaurant.ratingsAverage =f;
  
  await restaurant.save();

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

  // Find all reviews by the user and populate the 'order' field
  const reviews = await Review.find({ user: userId }).populate('order');

  // Map over each review and modify the structure
  const populatedReviews = await Promise.all(reviews.map(async (review) => {
    const order = review.order;
    
    // Lookup for restaurant name
    const restaurant = await Restaurant.findById(order.restaurant);

    // Array to store promises for fetching food names
    const foodNamesPromises = order.items.map(async (foodItem) => {
      const food = await Food.findById(foodItem.food);
      // Return only the food name
      return food ? food.name : 'Unknown Food';
    });

    // Wait for all food name promises to resolve
    const foodNames = await Promise.all(foodNamesPromises);

    // // Extract the date part from createdAt
    // const createdAtDate = new Date(order.createdAt).toISOString().split('T')[0];

    // Extract the required fields
    const populatedReview = {
      restaurantName: restaurant ? restaurant.name : 'Unknown Restaurant',
      foodNames: foodNames,
      review: review.review,
      rating: review.rating,
      createdAt: order.createdAt
    };

    return populatedReview;
  }));

  // Send the populated reviews
  res.status(200).json(populatedReviews);
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
  const data = await Review.find({});
  res.status(200).send(data);
});
