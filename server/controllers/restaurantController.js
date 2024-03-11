const Restaurant = require("./../models/restaurantModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Food = require("./../models/foodModel");
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (restaurant, statusCode, res) => {
  const token = signToken(restaurant._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      restaurant,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newRestaurant = await Restaurant.create({
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
    type: req.body.type,
    //   ownerName: req.body.owner,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    accountCreatedAt: Date.now(),
  });

  createSendToken(newRestaurant, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please Provide email and password", 400));
  }

  //finding the restaurant using email and also saving password
  const resUser = await Restaurant.findOne({ email }).select("+password");
  // console.log(user);
  const correct = await resUser.correctPassword(password, resUser.password);

  if (!resUser || !correct) {
    return next(new AppError("Incorrect Email or password", 401));
  }
  createSendToken(resUser, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    //401 stands for unauthorized
    return next(
      new AppError("You are not logged in ! Please log in to get acess", 401)
    );
  }
  //2)Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if User still Exists
  const freshRestaurant = await Restaurant.findById(decoded.id);
  if (!freshRestaurant) {
    return next(
      new AppError("The user belonging to this token does not exist.", 401)
    );
  }
  //4)check if user changed password after JWT was issued
  if (freshRestaurant.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password!,please log in again", 401)
    );
  }
  //all 4 steps verified then we grant acess of user to the next chained middleware
  req.restaurant = freshRestaurant;
  next();
});

exports.dashboard = catchAsync(async (req, res, next) => {
  try {
    const restaurantId = req.user._id;

    // Fetch restaurant details
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return next(new AppError("Restaurant not found", 404));
    }

    // Fetch active status
    const isActive = restaurant.active || false;

    // Fetch menu items
    const menu = await Food.find({ restaurant: restaurantId });

    // Create a dashboard object with restaurant details, active status, and menu
    const restaurantDashboard = {
      details: {
        name: restaurant.name,
        type: restaurant.type,
        address: restuarant.address,
        email: restaurant.email,
        profilePic: restaurant.profilePic,
      },
      isActive,
      menu,
      //   menu: menu.map((foodItem) => ({
      //     name: foodItem.name,
      //     type: foodItem.type,
      //     price: foodItem.price,
      //     description: foodItem.description,
      //     image: foodItem.image,
      //     active: foodItem.active,
      //   })),
    };

    return res.status(200).json(restaurantDashboard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});


exports.deleteRestaurant = catchAsync(async (req,res,next)=>{  

  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

  if (!restaurant) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(204).json({      
      status:'success',
      data: null,
      message:'Document Deleted Successfully'
  });
});

exports.getRestaurant =  catchAsync(async (req,res,next)=>{   
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
   return next(new AppError('No document found with that ID', 404));
  } 

  res.status(200).json({
      status:'success',
      data:{
          restaurant
        }
  });
});

exports.getAllRestaurants = catchAsync(async (req,res,next)=>{ 
  const allRestaurants= await Restaurant.find({ active: true });
  
  return res.status(200).json({
      status:'success',
      result: allRestaurants.length,
      data:{
          data : allRestaurants
      }

    });
    

exports.addItem= catchAsync(async (req, res, next) => {
    const newFoodItem = await Food.create({
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        description: req.body.description,
        // image: req.body.image,
        restaurant: req.restaurant.id,
      
      });
    
      res.status(201).json({
        status: "success",
        data: {
          foodItem: newFoodItem,
        },
      });
  });


exports.getAllPendingRestaurants = catchAsync(async (req,res,next)=>{ 
  const allPendingRestaurants= await Restaurant.find({ active: false });
  
  return res.status(200).json({
      status:'success',
      result: allPendingRestaurants.length,
      data:{
          data : allPendingRestaurants
      }
  });
});

exports.approvePendingRestaurants = catchAsync(async (req,res,next)=>{ 
  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { active: true }, {
    new: true,
    runValidators: true
  });
  
  return res.status(200).json({
      status:'success',
      data:{
          data : restaurant
      }
  });
});