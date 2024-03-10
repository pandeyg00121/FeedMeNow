const Restaurant = require("./../models/restaurantModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Food= require("./../models/foodModel");
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require('jsonwebtoken');
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
  
    createSendToken(newRestaurant,201,res);
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
  createSendToken(resUser,200,res);
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
  const freshRestaurant= await Restaurant.findById(decoded.id);
  if (!freshRestaurant) {
    return next(
      new AppError("The user belonging to this token does not exist.", 401)
    );
  }
  //4)check if user changed password after JWT was issued
  // if (freshRestaurant.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError("User recently changed password!,please log in again", 401)
  //   );
  // }
  //all 4 steps verified then we grant acess of user to the next chained middleware
  req.restaurant = freshRestaurant;
  next();
});

exports.dashboard = catchAsync(async(req,res,next)=>{

});


exports.addItem= catchAsync(async (req, res, next) => {
    const newFoodItem = await Food.create({
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        description: req.body.description,
        // image: req.body.image,
        restaurant: req.restaurant,
      
      });
    
      res.status(201).json({
        status: "success",
        data: {
          foodItem: newFoodItem,
        },
      });

});
