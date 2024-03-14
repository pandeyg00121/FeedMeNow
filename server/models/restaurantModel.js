const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");
const crypto = require("crypto");
// const Food = require("./foodModel");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name of your establishment"],
  },
  slug: String,
  type: {
    type: String,
    enum: ["cafe", "restaurant", "canteen", "takeout"],
    required: [true, "Please choose your type of establishment"],
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  email: {
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
  ratingsAverage: {
    type: Number,
    default: 4,
    max: [5, "A tour must have less than or equal to 5 rating"],
    //these both are DATA Vatidators
    min: [1, "A tour must have more than or equal to 1 rating"],
    //set used to round of ratingAverage
    set: (val) => Math.round(val * 10) / 10,
    //val=4.666666 -> round(4.666666*10) -> round(46.6666) -> 47/10 -> 4.7
  },
  //no of ratings
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  images: [String],
  active: {
    type: Boolean,
    default: true,
    // select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviews",
    },
  ],
  fooditems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
  accountCreatedAt: Date,
});
restaurantSchema.index({ slug: 1 });

restaurantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  this.slug = slugify(this.name, { lower: true });
  next();
});

restaurantSchema.methods.correctPassword = async function (
  candidatePassword,
  resPassword
) {
  return await bcrypt.compare(candidatePassword, resPassword);
};

restaurantSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
    // JWTTimestamp-> time when token issued(100)
    // changedTimestamp -> time when password changed(200)
    //return true if pswd changed after token issued time (100<200 )->true
  }
  //false means password Not changed
  return false;
};

restaurantSchema.methods.createPasswordResetToken = function () {
  //generating a token
  const resetToken = crypto.randomBytes(32).toString("hex");
  //hashing  the token before savin to DB by sha256 algo
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //ten minutes to reset otherwise token expires
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
