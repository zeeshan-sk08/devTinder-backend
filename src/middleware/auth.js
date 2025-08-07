const adminAuth = (req, res, next) => {
  console.log("Auhtenticating admin...");

  let token = "xyz";
  let isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("Unauthorized access!");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("Auhtenticating user...");

  let token = "xyz";
  let isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("Unauthorized access!");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
