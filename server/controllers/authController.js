const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const sendMail = require("./../utils/sendMail");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Cart = require("./../models/cartModel");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = catchAsync(async (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  const userId = user._id; // Adjust this according to your authentication method
  const userCart = await Cart.findOne({ user: userId });
  let cartItems = "";
  // Extracting specific data from the cart object
  if(userCart){
    cartItems = userCart.restaurants
    .map((restaurant) => {
      return restaurant.items.map((item) => ({
        foodId: item.food,
        quantity: item.quantity,
        restaurantId: restaurant.restaurant,
      }));
    })
    .flat();
  }
  else{
    cartItems="";
  }
  // Store extracted cart data in res.locals for access in routes
  // res.locals.cart = cartItems;
  // req.cart = cartItems;

  return res.status(statusCode).json({
    status: "success",
    cart: cartItems,
    token,
    data: {
      user,
    },
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const username = req.body.name.split(" ")[0];
  const gender = req.body.gender;
  const userEmail = req.body.email;

  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

  // const apiUrl = `https://api-bdc.net/data/email-verify?emailAddress=${userEmail}&key=${process.env.BIG_DATA_API_KEY}`;
  // const response = await axios.get(apiUrl);
  // console.log(response.data);

  // if(!response.data.isValid)
  // return next(new AppError("Please Provide valid Email", 400));

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    location: req.body.location,
    profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    accountCreatedAt: Date.now(),
  });
  const verificationCode = newUser.createVerificationCode();
  await newUser.save({ validateBeforeSave: false });

  const redirectUrl = `${req.protocol}://127.0.0.1:5500/api/users/verifyemail/${verificationCode}`;

  const to = newUser.email;
  const subject = "Account verification link";
  const message = ` Kindly click on the link ${redirectUrl} to verify your account status`;
  sendMail(to, subject, message);

  console.log(redirectUrl);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please Provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  // console.log(user);
  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError("Incorrect Email or password", 401));
  }
  console.log(user.active);

  if (!user.active) {
    return next(
      new AppError(
        `Your Email is not verified yet Check your ${user.email} for link `,
        401
      )
    );
  }
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
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

  //3) Check if User still Exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token does not exist.", 401)
    );
  }
  //4)check if user changed password after JWT was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password!,please log in again", 401)
    );
  }
  //all 4 steps verified then we grant acess of user to the next chained middleware
  res.locals.user = freshUser;
  req.user = freshUser;
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

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user on POSTed Email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with email address", 404));
  }

  // 2) Generate token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) Send it to user's email
  const resetURL = `${req.protocol}://127.0.0.1:5500/api/users/resetPassword/${resetToken}`;
  console.log(resetURL);
  const message = `Forgot your password? Submit a PATCH request with your new password and 
  passwordConfirm to:${resetURL}.\n If not prompted ignore this message`;

  res.status(200).json({
    status: "success",
    mesaage: message,
  });
});

exports.verifyEmailHandler = catchAsync(async (req, res, next) => {
  //1)Get user based on the code
  const verificationCode = crypto
    .createHash("sha256")
    .update(req.params.verificationCode)
    .digest("hex");

  const user = await User.findOne({
    verificationCode,
  });

  if (!user) {
    return next(new AppError("Invalid Registration Link...", 400));
  }
  user.active = true;
  user.verificationCode = null;
  // await user.save({ validateBeforeSave: false });
  //4) log the user in send JWT
  createSendToken(user, 200, res);
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  //2)If token has not expired and user exists then set the new password
  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  //if we update the password we make reset token undefined
  user.passwordResetToken = undefined;

  await user.save();

  //3)update changed password property for the user
  //updated changedPassword field in DB using pre save method of mongoose

  //4) log the user in send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");
  console.log(req.body.passwordCurrent,req.body.password,req.body.passwordConfirm);
  // 2) Check if POSTed current password is correct
  console.log(user.password);
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
