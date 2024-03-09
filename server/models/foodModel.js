const mongoose = require("mongoose");
const validator = require("validator");
// const Restaurant = require("./restaurantModel");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Food must have a name"],
  },
  type: {
    type: String,
    required: [true, "A Food must have a type"],
  },
  price: {
    type: Number,
    required: [true, "A Food must have some price"],
  },
  description: {
    type: String,
    required: [true, "A Food must have a description"],
    minLength: 8,
    select: false,
  },
  image: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  reviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Reviews",
    },
  ],
  restaurant:
  {
    required:true,
    type:mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  }
});


const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
