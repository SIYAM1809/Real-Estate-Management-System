// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Log = require('../models/Log'); // Import the Log model

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'Buyer' 
  });

  if (user) {
    // Log the event (Optional for registration, but good for tracking)
    await Log.create({
      action: 'LOGIN_ATTEMPT',
      user: user._id,
      details: `New user registered: ${email}`,
      ip: req.ip
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // SUCCESSFUL LOGIN
    await Log.create({
      action: 'LOGIN_ATTEMPT',
      user: user._id,
      details: `Successful login for ${email}`,
      ip: req.ip
    });

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    // FAILED LOGIN (Security Requirement: Log unauthorized attempts)
    await Log.create({
      action: 'LOGIN_ATTEMPT',
      details: `Failed login attempt for ${email}`,
      ip: req.ip
    });

    res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};