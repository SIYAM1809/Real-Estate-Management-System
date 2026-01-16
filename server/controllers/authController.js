// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Log = require('../models/Log'); // Your file exists ✅

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Normalize role so it always matches your User schema enum
const normalizeRole = (role) => {
  const r = role ? String(role).trim().toLowerCase() : 'buyer';
  if (r === 'buyer' || r === 'seller' || r === 'admin') return r;
  return 'buyer';
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedRole = normalizeRole(role);

  // Check if user exists
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // ✅ Hash password (required)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: normalizedRole,
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid user data');
  }

  // ✅ Logging (use allowed enum values)
  await Log.create({
    action: 'LOGIN_ATTEMPT',
    user: user._id,
    details: `New user registered: ${normalizedEmail}`,
    ip: req.ip,
  });

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    await Log.create({
      action: 'LOGIN_ATTEMPT',
      details: `Failed login attempt (user not found): ${normalizedEmail}`,
      ip: req.ip,
    });
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    await Log.create({
      action: 'LOGIN_ATTEMPT',
      user: user._id,
      details: `Failed login attempt (wrong password): ${normalizedEmail}`,
      ip: req.ip,
    });
    res.status(401);
    throw new Error('Invalid credentials');
  }

  await Log.create({
    action: 'LOGIN_ATTEMPT',
    user: user._id,
    details: `Successful login: ${normalizedEmail}`,
    ip: req.ip,
  });

  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

module.exports = {
  registerUser,
  loginUser,
};
