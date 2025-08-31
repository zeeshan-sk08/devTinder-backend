const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const updatedData = req.body;
    if (!validateEditProfileData(updatedData)) {
      throw new Error("Invalid fields in request body!");
    }

    const loggedInUser = req.user;
    Object.keys(updatedData).forEach(
      (key) => (loggedInUser[key] = updatedData[key])
    );

    await loggedInUser.save();

    res.send({
      message: loggedInUser.firstName + " profile updated successfull!",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
