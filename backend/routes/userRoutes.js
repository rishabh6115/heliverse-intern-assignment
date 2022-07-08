const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  deleteUser,
  renameUser,
} = require("../controllers/userControllers");
const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);

router.route("/:userId").delete(protect, deleteUser).put(protect, renameUser);

router.post("/login", authUser);

module.exports = router;
