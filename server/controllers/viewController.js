const Restaurant = require("../models/restaurantModel");
const Food = require("../models/foodModel");

const APIFeatures=require('./../utils/apiFeatures');
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.aliasTopRestaurants=(req,res,next)=>{ 
  req.query.limit='5';
  req.query.sort='-ratingsAverage';
  req.query.fields='name,ratingsAverage,ratingsQuantity,slug,images';
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
    res.status(200).send(doc);
});

exports.getRestaurant = catchAsync(async (req, res) => {
  //1) Get the data for req tour
  const restaurantObject = await Restaurant.findOne({
    slug: req.params.slug,
  });
//   .populate({
//     path: "reviews",
//     fields: "review rating user",
//   });
const restId=restaurantObject._id;
const foods = await Food.find({restaurant:restId});
const restaurantInfo = {
  name: restaurantObject.name,
  address: restaurantObject.location.address,
  rating: restaurantObject.ratingsAverage,
  images: restaurantObject.images,
  foods,
  location: {
      lat: restaurantObject.location.coordinates[1],
      lng: restaurantObject.location.coordinates[0]
  }
};
  res.status(200).send(restaurantInfo);
});

exports.aliasTopFoods=(req,res,next)=>{ 
  req.query.limit='6';
  req.query.sort='price';
  req.query.fields='name,type,category,price,slug,description,image';
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
  // const doc = await Food.find();
  // SEND RESPONSE
  res.status(200).send(doc);
  });
  
  exports.getFood = catchAsync(async (req, res) => {
    //1) Get the data for req food
    const food = await Food.findOne({
      slug: req.params.slug,
    });
  
    res.status(200).json(food);
  });
  