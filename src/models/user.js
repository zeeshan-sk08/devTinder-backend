const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userScheme = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid!");
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong!");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender is not valid!");
        }
      },
    },
    about: {
      type: String,
      default: "This is default about me section.",
    },
    photo: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is not valid!");
        }
      },
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvxJY8zzNz0lnMMIBkUOmwYc1QexW18zIp5g&s",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userScheme.index({ firstName: 1 });

userScheme.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$786", {
    expiresIn: "7d",
  });

  return token;
};

userScheme.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User", userScheme);
