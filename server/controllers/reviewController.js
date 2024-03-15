const Order = require("./../models/orderModel");
const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// Add a review
exports.addReview = catchAsync(async (req, res, next) => {
  const { review, rating, orderId } = req.body;
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

  const reviews = await Review.find({ user: userId }).populate('order');

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
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
