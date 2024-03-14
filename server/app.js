const express = require("express");
const path = require("path");
const morgan = require("morgan");
var bodyParser = require("body-parser");
const AppError = require("./utils/appError");
const cookieParser = require("cookie-parser");
const cors =require('cors');

const userRouter = require("./routes/userRoutes");
const foodRouter = require('./routes/foodRoutes');
const restaurantRouter = require('./routes/restaurantRoutes');
const viewRouter = require('./routes/viewRoutes');
const adminRouter = require('./routes/adminRoutes');


const app = express();
// Enable CORS middleware
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
});
//cross site scripting overcome
app.use(bodyParser.urlencoded({ limit: "10kb", extended: false }));
app.use(cookieParser());
//for develpment and status code on console
app.use(morgan("dev"));

app.use((req,res,next)=>{
  // req.requestTime = new Date.toISOString();
  // console.log(req.cookies);
  next();
});

app.use("/api/users", userRouter);
app.use("/api/foods", foodRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/admin", adminRouter);
app.use('/api',viewRouter);

app.use('/',(req,res)=>{
  res.status(200).json({
      status: "success",
      message: "this is home page"
  })
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server now`, 404));
});

module.exports = app;
