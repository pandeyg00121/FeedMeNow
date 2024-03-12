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
  const restaurant = await Restaurant.findOne({ email }).select("+password");

  const correct = await restaurant.correctPassword(password, restaurant.password);

  if (!restaurant || !correct) {
    return next(new AppError("Incorrect Email or password", 401));
  }
  createSendToken(restaurant, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    //401 stands for unauthorized
    return next(
      new AppError("You are not logged in ! Please log in to get acess", 401)
    );
  }
  //2)Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if restaurant still Exists
  const freshRestaurant = await Restaurant.findById(decoded.id);
  if (!freshRestaurant) {
    return next(
      new AppError("The restaurant belonging to this token does not exist.", 401)
    );
  }
  //4)check if restaurant changed password after JWT was issued
  if (freshRestaurant.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("restaurant recently changed password!,please log in again", 401)
    );
  }
  //all 4 steps verified then we grant acess of restaurant to the next chained middleware
  res.locals.restaurant = freshRestaurant;
  req.restaurant = freshRestaurant;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if restaurant still exists
      const currentRestaurant = await Restaurant.findById(decoded.id);
      if (!currentRestaurant) {
        return next();
      }

      // 3) Check if restaurant changed password after the token was issued
      if (currentRestaurant.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN restaurant
      res.locals.restaurant = currentRestaurant;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
exports.dashboard = catchAsync(async (req, res, next) => {
  try {
    const restaurantId = req.restaurant.id;

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
        // address: restuarant.address,
        email: restaurant.email,
        // profilePic: restaurant.profilePic,
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


exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get restaurant on POSTed Email
  const restaurant = await Restaurant.findOne({ email: req.body.email });

  if (!restaurant) {
    return next(new AppError("There is no restaurant with email address", 404));
  }

  // 2) Generate token
  const resetToken = restaurant.createPasswordResetToken();
  await restaurant.save({ validateBeforeSave: false });

  //3) Send it to restaurant's email
  const resetURL = `${req.protocol}://127.0.0.1:5500/api/restaurants/resetPassword/${resetToken}`;
  console.log(resetURL);
  const message = `Forgot your password? Submit a PATCH request with your new password and 
  passwordConfirm to:${resetURL}.\n If not prompted ignore this message`;

  res.status(200).json({
      status: "success",
      mesaage: message,
    });
   
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1)Get restaurant based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const restaurant = await Restaurant.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  //2)If token has not expired and restaurant exists then set the new password
  if (!restaurant) {
    return next(new AppError("Token is invalid or expired", 400));
  }
  restaurant.password = req.body.password;
  restaurant.passwordConfirm = req.body.passwordConfirm;
  //if we update the password we make reset token undefined
  restaurant.passwordResetToken = undefined;

  await restaurant.save();

  //3)update changed password property for the restaurant
  //updated changedPassword field in DB using pre save method of mongoose

  //4) log the restaurant in send JWT
  createSendToken(restaurant, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get restaurant from collection
  const restaurant = await Restaurant.findById(req.restaurant.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await restaurant.correctPassword(req.body.passwordCurrent, restaurant.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  restaurant.password = req.body.password;
  restaurant.passwordConfirm = req.body.passwordConfirm;
  await restaurant.save();
  // restaurant.findByIdAndUpdate will NOT work as intended!

  // 4) Log restaurant in, send JWT
  createSendToken(restaurant, 200, res);
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

exports.getMe = (req, res, next) => {
  req.params.id = req.restaurant.id;
  next();
};

exports.closeMe = catchAsync(async (req, res, next) => {
  await Restaurant.findByIdAndUpdate(req.restaurant.id, { active: false });

  res.status(204).json({
    message: "Your Restaurant is now closed successfully",
  });
});

exports.openMe = catchAsync(async (req, res, next) => {
  await Restaurant.findByIdAndUpdate(req.restaurant.id, { active: true });

  res.status(204).json({
    message: "Your Restaurant is now opened successfully",
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
});   

exports.addItem= catchAsync(async (req, res, next) => {
    const newFoodItem = await Food.create({
        name: req.body.name,
        type: req.body.type,
        category:req.body.category,
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
