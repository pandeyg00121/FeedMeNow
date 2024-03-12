const User = require('./../models/userModel');
const catchAsync =require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.updateUser = catchAsync(async (req,res,next)=>{   

    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators: true
        //if this set to false then the built in validators will not be checked
    });

    if (!user) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status:'success',
        data:{
            user
        }
    });
});

exports.deleteUser = catchAsync(async (req,res,next)=>{  

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({      
        status:'success',
        data: null,
        message:'Document Deleted Successfully'
    });
});

exports.getUser =  catchAsync(async (req,res,next)=>{   
    const user = await User.findById(req.params.id);


    if (!user) {
     return next(new AppError('No document found with that ID', 404));
    } 

    res.status(200).json({
        status:'success',
        data:{
            user
          }
    });
});

exports.getAllUsers = catchAsync(async (req,res,next)=>{ 
    const allUsers = await User.find({ role: { $ne: 'admin' } });
    
    console.log('hellooo');
    return res.status(200).json({
        status:'success',
        result: allUsers.length,
        data:{
            data : allUsers
        }
    });
});

exports.getMe = (req,res,next)=>{
    req.params.id = req.user.id;
    next();
};