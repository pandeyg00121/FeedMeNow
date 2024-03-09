const express = require("express");
const path = require("path");
const morgan = require("morgan");
var bodyParser = require("body-parser");
const userRouter = require("./routes/userRoutes");
const foodRouter = require('./routes/foodRoutes');
const app = express();

app.use(bodyParser.urlencoded({ limit: "10kb", extended: false }));

//for develpment and status code on console
app.use(morgan("dev"));

app.use("/api/users", userRouter);
app.use("/api/foods", foodRouter);

const home = (req, res) => {
  res.send("helloo from server");
};
app.get("/", home);

module.exports = app;
