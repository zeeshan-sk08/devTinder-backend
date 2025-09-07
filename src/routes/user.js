const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const RequestConnection = require("../models/requestconnection");

const USER_DATA = "firstName lastName age gender about photo skills";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const requests = await RequestConnection.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", USER_DATA);

    res.json({ message: "Data fetched successfully!", data: requests });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  const connections = await RequestConnection.find({
    $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
  })
    .populate("fromUserId", USER_DATA)
    .populate("toUserId", USER_DATA);

  const data = connections.map((item) => {
    if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
      return item.toUserId;
    }

    return item.fromUserId;
  });

  res.json({ data: data });
});

module.exports = userRouter;
