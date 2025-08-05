const express = require("express");

const app = express();


app.use("/", (req, res) => {
    res.send("Hello from Server");
  });
  

app.use("/test", (req, res) => {
    res.send("Hello lets learn node js");
  });




app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
