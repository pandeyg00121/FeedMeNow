const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.signup = catchAsync(async (req, res, next) => {
    const username = req.body.name;
    const gender = req.body.gender;

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
  
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      gender: req.body.gender,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      accountCreatedAt: Date.now(),
    });
  
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
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
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
