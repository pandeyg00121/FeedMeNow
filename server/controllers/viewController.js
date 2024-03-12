const Restaurant = require("../models/restaurantModel");
const Food = require("../models/foodModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.home = (req,res)=>{
    res.status(200).json({
        status: "success",
        message: "this is home page"
    })
}

exports.getOverview = catchAsync(async (req, res) => {
  const restaurants = await Restaurant.find();

  res.status(200).json({
    status: "success",
    data: {
      title: "All Restaurants",
      length: restaurants.length,
      restaurants,
    },
  });
});

exports.getRestaurant = catchAsync(async (req, res) => {
  //1) Get the data for req tour
  const restaurant = await Restaurant.findOne({
    slug: req.params.slug,
  });
//   .populate({
//     path: "reviews",
//     fields: "review rating user",
//   });

  res.status(200).json({
    status: "success",
    data: {
      title: `${restaurant.name}`,
      restaurant,
    },
  });
});

exports.getAllFoods = catchAsync(async (req, res) => {
    const foods = await Food.find();
  
    res.status(200).json({
      status: "success",
      data: {
        title: "All foods",
        length: foods.length,
        foods,
      },
    });
  });
  
  exports.getFood = catchAsync(async (req, res) => {
    //1) Get the data for req food
    const food = await Food.findOne({
      slug: req.params.slug,
    });
  
    res.status(200).json({
      status: "success",
      data: {
        title: `${food.name}`,
        food,
      },
    });
  });
  