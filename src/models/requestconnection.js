const mongoose = require("mongoose");

const requestConnectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: String,
      required: true,
    },
    toUserId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is incorrect status type",
      },
    },
  },
  {
    timestamps: true,
  }
);

requestConnectionSchema.index({ fromUserId: 1, toUserId: 1 });

requestConnectionSchema.pre("save", function (next) {
  const connectionRequest = this;
  console.log(connectionRequest.fromUserId);
  console.log(connectionRequest.toUserId);

  if (connectionRequest.fromUserId === connectionRequest.toUserId) {
    throw new Error("From and To userId cannot be same.");
  }

  next();
});

module.exports = mongoose.model("RequestConnection", requestConnectionSchema);
