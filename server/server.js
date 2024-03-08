const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception ...");
  console.log(err.name, err.message);
  process.exit(1);
});
// const URI= process.env.MONGODB_URL;
mongoose
  .connect("mongodb://localhost:27017/FeedMe")
  .then(() => console.log("DB connected Successfull...."));

const port = process.env.PORT;

const server = app.listen(port, () => {
  const date = new Date(); // Get the current date and time
  const jsonString = JSON.stringify(date);
  console.log(jsonString);

  console.log(`App running at port: ${port}....`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection...");
  console.log(err.name, err.message);
  //close the server
  server.close(() => {
    process.exit(1);
  });
});
