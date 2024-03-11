const express = require("express");
const path = require("path");
const morgan = require("morgan");
var bodyParser = require("body-parser");
const AppError = require("./utils/appError");

const userRouter = require("./routes/userRoutes");
const foodRouter = require('./routes/foodRoutes');
const restaurantRouter = require('./routes/restaurantRoutes');
const adminRouter = require('./routes/adminRoutes');
const viewRouter = require('./routes/viewRoutes');


const app = express();
//cross site scripting overcome
app.use(bodyParser.urlencoded({ limit: "10kb", extended: false }));

//for develpment and status code on console
app.use(morgan("dev"));

app.use("/api/users", userRouter);
app.use("/api/foods", foodRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/admin", adminRouter);
app.use('/',viewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
