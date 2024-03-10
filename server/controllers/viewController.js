const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.home = (req, res,next) => {
    res.send("helloo from server");
};

exports.search = catchAsync(async(req,res,next)=>{
    log(req.query);
    next(new AppError(`Can't find ${req.query} on this server h`, 404));
});