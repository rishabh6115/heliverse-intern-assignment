const jwt = require("jsonwebtoken");
const User = require("../Modals/userModal");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized,token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized,token failed");
  }
});

module.exports = { protect };
