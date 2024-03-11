const mongoose = require('mongoose');
const validator = require("validator");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  restaurants: [
    {
      restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', // Reference to the Restaurant model
        required: true,
      },
      items: [
        {
          food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food', // Reference to the Food model
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Delivered'],
    default: 'Pending',
  },
  // Add any other necessary fields such as delivery address, payment information, etc.
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
