const asyncHandler = require("express-async-handler");
const User = require("../Modals/userModal");
const generateToken = require("../config/generateToken");
const { findById } = require("../Modals/userModal");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create a user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    throw new Error("Invalid UserName or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);
  res.send("deleted! YOu can test it by searching all users");
});

const renameUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  const { name } = req.body;
  await User.findByIdAndUpdate(userId, { name });
  const user = await User.findById(userId);
  res.send(user);
});

module.exports = { registerUser, authUser, allUsers, deleteUser, renameUser };
