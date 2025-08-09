const express = require("express");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Zeeshan",
    lastName: "Shaikh",
    emailId: "zeeshan@123.com",
    password: "zeeshan123",
  });

  try {
    await user.save();
    res.send("User added sucessfully!");
  } catch (err) {
    res.status(400).send("Error adding user:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Failed to connect to the database", err);
  });
