const express = require("express");
const requestRouter = express.Router();
const RequestConnection = require("../models/requestconnection");

const { userAuth } = require("../middleware/auth");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;
      const status = req.params.status;

      const isStatusValid = ["interested", "ignored"].includes(status);

      if (!isStatusValid) {
        throw new Error(status + " is not valid status.");
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        throw new Error("User not found!");
      }

      const existingRequest = await RequestConnection.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingRequest) {
        throw new Error(
          "Connection request already exists between these users."
        );
      }

      const connectionReques = new RequestConnection({
        fromUserId,
        toUserId,
        status,
      });

      await connectionReques.save();
      res.send("Connection request sent successfullt!");
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status!");
      }

      const connectionRequest = await RequestConnection.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!connectionRequest) {
        res.status(404).json({ message: "Connection request not found!" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request " + status + " successfully!",
        data: data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
