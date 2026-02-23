const express = require("express");

const {
  registerController,
  loginController,
  getAllUsers,
} = require("./controller/usercontroller");

const {
  getMessagesController,
  markAsSeenController,   
} = require("./controller/messageController");

const router = express.Router();

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Get all users
router.get("/users", getAllUsers);

// Get messages
router.get("/messages/:user1/:user2", getMessagesController);

// Mark seen
router.post("/seen", markAsSeenController);

module.exports = router;