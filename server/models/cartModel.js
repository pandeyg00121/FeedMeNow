//cart will contain
//user id,  
//restaurant id
//food item id
//unique feature abt our cart is it can contain upto 3 restaurants at once

const mongoose = require("mongoose");
const validator = require("validator");


const cartSchema = new mongoose.Schema({
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
              default: 1,
            },
          },
        ],
      },
    ],
  });
  
  //  one user can have only one cart per restaurant
  cartSchema.index({ user: 1, 'restaurants.restaurant': 1 }, { unique: true });
  
  // Limiting the number of restaurants in the cart to three
  cartSchema.path('restaurants').validate((value) => value.length <= 3, 'Cart can have at most three restaurants.');
  
  const Cart = mongoose.model('Cart', cartSchema);
  
  module.exports = Cart;