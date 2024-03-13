const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");
// const Restaurant = require("./restaurantModel");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Food must have a name"],
  },
  slug: String,
  type: {
    type: String,
    enum :["veg","non-veg"],
    default: "veg",
    required: [true, "A Food must have a type"],
  },
  category: {
    type: String,
    enum :["Beverages","Chinese","Dessert","Fast-food","North-indian","South-indian","Sweets"],
    default:"North-indian",
    required: [true, "A Food must have a type"],
  },
  price: {
    type: Number,
    required: [true, "A Food must have some price"],
  },
  description: {
    type: String,
    required: [true, "A Food must have a description"],
    default:"good food",
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
  restaurant:
  {
    required:true,
    type:mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  }
});

foodSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
