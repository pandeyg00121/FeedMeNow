const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
// const Food = require("./foodModel");

const restaurantSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter the name of your establishment"],
    },
    type:{
        type: String,
        enum: ["cafe", "restaurant", "canteen" , "takeout"],
        required: [true, "Please choose your type of establishment"],
    },
    address:{
        type:String,
        required:[true, "Please enter the address of your establishment"],
    },
    // ownerName:
    // {
    //     type:String,
    //     required:[true, "Please enter your own name"],
    // },
    email:
    {
    type: String,
    required: [true, "Please enter Email Id"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Password please"],
        minLength: 8,
        select: false,
    },
      passwordConfirm: {
        type: String,
        required: [true, "Please Confirm Your Password"],
        validate: {
          validator: function (el) {
            return el === this.password;
          },
          message: "Password And Confirm Password Do not match",
        },
      },
      profilePic: {
        type: String,
        default: "",
      },
      active: {
        type: Boolean,
        default: false,
        // select: false,
      },
      reviews: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Reviews",
        },
      ],
      fooditems:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Food",
        }
      ],
      accountCreatedAt: Date,
});

restaurantSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    this.password = await bcrypt.hash(this.password, 12);
  
    this.passwordConfirm = undefined;
    next();
  });
  
  restaurantSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  
  const Restaurant = mongoose.model("Restaurant", restaurantSchema);
  module.exports = Restaurant;
  