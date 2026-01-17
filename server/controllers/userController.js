// server/controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedRole = role ? String(role).trim().toLowerCase() : 'buyer';

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

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

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// @desc    Authenticate a user
// @route   POST /api/users/login
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
    res.status(400);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Add or Remove property from favorites (BUYER ONLY)
// @route   PUT /api/users/favorites/:id
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Favorites are available for buyers only.' });
    }

    const user = await User.findById(req.user.id);
    const propertyId = req.params.id;

    if (!user) {
      return res.status(401).json({ message: 'Not authorized (user missing)' });
    }

    const index = user.favorites.findIndex((id) => id.toString() === propertyId);

    let isAdded = false;
    if (index !== -1) {
      user.favorites.splice(index, 1);
      isAdded = false;
    } else {
      user.favorites.push(propertyId);
      isAdded = true;
    }

    await user.save();

    const updatedUser = await User.findById(req.user.id).populate('favorites');

    return res.status(200).json({
      message: isAdded ? 'Added to favorites' : 'Removed from favorites',
      favorites: updatedUser.favorites,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user favorites (BUYER ONLY)
// @route   GET /api/users/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Favorites are available for buyers only.' });
    }

    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized (user missing)' });
    }

    return res.status(200).json(user.favorites);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Forgot password - Send reset email
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });
    // Security: do NOT reveal if email exists
    if (!user) {
      return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
    }

    // Create reset token (raw) + store hashed in DB
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');

    // ✅ FIX: Store as timestamp number (milliseconds), not Date object
    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your SyntaxEstate password',
      text: `Reset your password using this link (valid for 15 minutes): ${resetLink}`,
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Password Reset</h2>
          <p>Click to reset your password (valid for <b>15 minutes</b>):</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reset password with token
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const rawToken = req.params.token;
    const newPassword = String(req.body.password || '');
    if (!rawToken) return res.status(400).json({ message: 'Token missing.' });
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

    // ✅ FIX: Compare with Date.now() (timestamp number) not new Date() (Date object)
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() }, // Compare numbers, not Date objects
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token.' });

    // Hash and set password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({ message: 'Password reset successful. Please login.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  toggleFavorite,
  getFavorites,
  forgotPassword,
  resetPassword,
};