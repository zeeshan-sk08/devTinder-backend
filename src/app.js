const express = require("express");

const app = express();
const { adminAuth, userAuth } = require("./middleware/auth");

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("User data is fetched!");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All data is fetched!");
});

app.delete("/admin/deleteData", (req, res) => {
  res.send("Data has been deleted!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
