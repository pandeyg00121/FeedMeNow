const Restaurant = require("../models/restaurantModel");
const Food = require("../models/foodModel");

const APIFeatures=require('./../utils/apiFeatures');
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.aliasTopRestaurants=(req,res,next)=>{ 
  req.query.limit='5';
  req.query.sort='-ratingsAverage';
  req.query.fields='name,ratingsAverage,ratingsQuantity';
  next();
}

// change this overview only 5 top rated restaurants
exports.getOverview = catchAsync(async (req, res) => {
    let filter={};
    if(req.params.restaurantId) 
    filter ={restaurant :req.params.restaurantId};

    const features=new APIFeatures(Restaurant.find(filter),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const doc = await features.query;
    
    // SEND RESPONSE
    res.status(200).json({
        status:'success',
        result: doc.length,
        data:{
            title: " Restaurants",
            data : doc
        }
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

exports.aliasTopFoods=(req,res,next)=>{ 
  req.query.limit='6';
  req.query.sort='price';
  req.query.fields='name,type,category,price,image';
  next();
}
// change this overview only 6 top cheapest food
exports.getAllFoods = catchAsync(async (req, res) => {
  let filter={};
  if(req.params.foodId) 
  filter ={food :req.params.foodId};

  const features=new APIFeatures(Food.find(filter),req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

  const doc = await features.query;
  
  // SEND RESPONSE
  res.status(200).json({
      status:'success',
      result: doc.length,
      data:{
          title: "Food",
          data : doc
      }
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
  