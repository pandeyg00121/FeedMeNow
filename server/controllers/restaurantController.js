const Restaurant = require("./../models/restaurantModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.signup = catchAsync(async (req, res, next) => {
  
    const newRestaurant = await Restaurant.create({
      name: req.body.name,
    //   address: req.body.address,
      email: req.body.email,
      type: req.body.type,
    //   ownerName: req.body.owner,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      accountCreatedAt: Date.now(),
    });
  
    res.status(201).json({
      status: "success",
      data: {
        restaurant: newRestaurant,
      },
    });
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
  return res.status(200).json({
    status: "success",
    data: {
      resUser,
    },
  });
});
