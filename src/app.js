const express = require("express");

const app = express();

app.get("/user", (req, res) => {
    try{
        throw new Error("ASdasdasd");
        res.send("User data is fetched!");
    } catch (err){
        res.status(500).send("Internal Server Error");
    }
  
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong!");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
