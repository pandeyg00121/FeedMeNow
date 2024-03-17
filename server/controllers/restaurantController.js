const Restaurant = require("./../models/restaurantModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Food = require("./../models/foodModel");
const axios = require('axios');
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const multer =require('multer');
// const sharp= require('sharp');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/restaurants');
  },
  filename: (req, file, cb) => {
    // restaurant-80980d0s9089d-333232325689.jpeg
    const ext = file.mimetype.split('/')[1];
    cb(null, `restaurant-${req.restaurant.id}-${Date.now()}.${ext}`);
  }
});

// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadRestaurantPhotos = upload.array('images',3);

exports.resizeRestaurantImages = catchAsync(async (req, res, next) => {
  if ( !req.files) return next();

  // 2) Images
  req.body.images = [];

  if (req.files && req.files.images) {
    // Use Promise.all to wait for all async operations to complete
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `restaurant-${req.restaurant.id}-${Date.now()}-${i + 1}.jpeg`;
        req.body.images.push(filename);
      })
    );
  } else {
    console.error('No images uploaded');
  }
    // console.log(req.body.images);
  next();
});

exports.updateImages = catchAsync(async (req, res, next) => {
  
  const files = req.files;
  if(!files)
  return next();
  console.log(files);
  // console.log(req.body);
  const filenames = files.map(file => file.filename);
  //1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password update.Please use update password",
        400
      )
    );
  }

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.restaurant.id, { $set: { images: filenames } },{
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      restaurant: updatedRestaurant,
    },
  });
});

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

  // const restaurantEmail=req.body.email;
  // const apiUrl = `https://api-bdc.net/data/email-verify?emailAddress=${restaurantEmail}&key=${process.env.BIG_DATA_API_KEY}`;
  // const response = await axios.get(apiUrl);
  // // console.log(response.data);

  // if(!response.data.isValid)
  // return next(new AppError("Please Provide valid Email", 400));

  const newRestaurant = await Restaurant.create({
    name: req.body.name,
    email: req.body.email,
    type: req.body.type,
    location:req.body.location,
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

  if(!restaurant)
  res.status(404).send('No Account with this mail id');

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
exports.manageItems = catchAsync(async (req, res, next) => {
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

    res.status(200).send(menu);
  }
  catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Server Error" });
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

exports.dashboard = catchAsync(async (req, res, next) => {
  res.send('hello from dashboard');
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
  
  return res.status(200).send(allRestaurants);
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
      res.status(201).send(newFoodItem);
  });

  const filterObj = (obj, ...allowedFields) => {
    const newobj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) newobj[el] = obj[el];
    });
    return newobj;
  };


exports.getAllPendingRestaurants = catchAsync(async (req,res,next)=>{ 
  const allPendingRestaurants= await Restaurant.find({ active: false });
  
  return res.status(200).send(allPendingRestaurants)
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

exports.resMap = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.find({}, 'name location.coordinates');
  const data = restaurants.map(restaurant => ({
    name: restaurant.name,
    coordinates: restaurant.location.coordinates
  }));
  res.status(200).send(data);
});

exports.editItem= catchAsync(async (req, res, next) => {
  const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    //if this set to false then the built in validators will not be checked
  });

  if (!food) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      food,
    },
  });
});

exports.deleteItem= catchAsync(async (req, res, next) => {
  const foodId= req.params.id;
  await Food.deleteOne({_id:foodId});
  
    res.status(201).send('Deleted one item');
});