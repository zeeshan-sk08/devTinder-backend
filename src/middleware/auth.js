const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new Error("Invalid token!");
    }

    const decoded = jwt.verify(token, "DEV@Tinder$786");
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error("User not found!");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { userAuth };
