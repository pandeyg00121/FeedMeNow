const Food = require("./../models/foodModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllFoods = catchAsync(async(req,res,next)=>{
    const food = await Food.find();

    res.status(200).json({
        status: "success",
        data: {
          food,
        },
    });
});

// exports.createFood = catchAsync(async(req,res,next)=>{
//     const newFood = await Food.create(req.body);
  
//     res.status(201).json({
//       status: 'success',
//       data: {
//         newFood
//       }
//     });
// });