const mongoose = require('mongoose')
const validator = require('validator')

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
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
    rpice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      //enum: ['Pending', 'Preparing', 'Delivered'],
      //default: 'Pending',
    },
    payment: {
      type: String,
      enum: ['Cash', 'Online'],
      default: 'Online',
    },
    createdAt: {
      type: Date,
      defualt: Date.now,
    },
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;
