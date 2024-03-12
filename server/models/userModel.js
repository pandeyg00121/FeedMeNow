const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A User must have a name"],
  },
  email: {
    type: String,
    required: [true, "A User must have a Email"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Regular expression to match email addresses ending with "@mnnit.ac.in"
        const emailRegex = /^[a-zA-Z0-9._%+-]+@mnnit\.ac\.in$/;
        return emailRegex.test(value);
      },
      message: (props) =>
        `${props.value} is not a valid email address ending with @mnnit.ac.in!`,
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: [true, "An account must have its type"],
    default: "user",
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  password: {
    type: String,
    required: [true, "A User must have a password"],
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
  address: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    address: String,
  },
  profilePic: {
    type: String,
    default: "",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  accountCreatedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
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

userSchema.methods.createPasswordResetToken = function () {
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

const User = mongoose.model("User", userSchema);
module.exports = User;
