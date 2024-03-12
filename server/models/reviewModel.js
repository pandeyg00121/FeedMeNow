const mongoose = require("mongoose");
const validator = require("validator");


const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      review: {
        type: String,
        required: [true, "Please enter your review"],
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Reference to the User model
        required: true,
      },
    });

  //one user can have only one review per order
  reviewSchema.index({user:1, order:1},{unique:true});

  const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;