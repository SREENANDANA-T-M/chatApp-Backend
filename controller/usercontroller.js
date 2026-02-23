const User = require("../models/UserModel");

// Register
exports.registerController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json("User already exists");
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json("Registration Failed");
  }
};

// Login
exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email, password });

    if (!existingUser) {
      return res.status(401).json("Invalid email or password");
    }

    res.status(200).json({
      username: existingUser.username,
    });
  } catch (err) {
    res.status(500).json("Login Failed");
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select("-password");
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json("Failed to fetch users");
  }
};