const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

const { validateSignUpData } = require("./utils/validation");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  try {
    // Validate the user data
    validateSignUpData(req.body);

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added sucessfully!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login successfully!");
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//Get user by email id
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;

  try {
    const users = await User.find({ emailId: emailId });

    if (users.length === 0) {
      res.status(404).send("User not found!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Feed API
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Delete user by ID
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Update the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    const allowedUpdate = ["gender", "age", "skills", "about", "photo"];
    const keys = Object.keys(data);

    const isAllowedUpdate = keys.every((k) => allowedUpdate.includes(k));

    if (!isAllowedUpdate) {
      throw new Error("Invalid update operation!");
    }

    if (data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10!");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true,
    });

    res.send("User updated successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong," + err.message);
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
