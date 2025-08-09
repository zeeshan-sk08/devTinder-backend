const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://shaikhzeeshan72:Developer123@learnnode.5vurbkr.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
