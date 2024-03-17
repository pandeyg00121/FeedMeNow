const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const multer =require('multer');
// const sharp= require('sharp');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    // user-80980d0s9089d-333232325689.jpeg
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
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

exports.uploadUserPhoto = upload.single('profilePic');


exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    //if this set to false then the built in validators will not be checked
  });

  if (!user) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
    message: "Document Deleted Successfully",
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find({ role: { $ne: "admin" } });

  // console.log("hellooo");
  return res.status(200).send(allUsers);
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//filter obj is function to only allow allowed fields like name and email to updateMe route
//so that no one can update role or any other token
const filterObj = (obj, ...allowedFields) => {
  const newobj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newobj[el] = obj[el];
  });
  return newobj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  //1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password update.Please use update password",
        400
      )
    );
  }
  //2) Filtering out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "gender" , "active");
  if(req.file)  filteredBody.profilePic = req.file.filename;
  //3) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.userMap = catchAsync(async (req, res, next) => {
  const users = await User.find({}, 'name location.coordinates');
  const data = users.map(user => ({
    name: user.name,
    coordinates: user.location.coordinates
  }));
  res.status(200).send(data);
});

exports.updateStatus = catchAsync(async (req, res, next) => {
  const newStatus = req.body.active;
  console.log(req.body);
  console.log(newStatus);
  const updatedUser = await User.findByIdAndUpdate(req.params.id, {active:newStatus}, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    status: "success",
    data: {
      data: updatedUser,
    },
  });
});
