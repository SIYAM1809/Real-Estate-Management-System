// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Log = require('../models/Log');

// safe logger (never crashes auth)
const safeLogUnauthorized = async (req, details) => {
  try {
    await Log.create({
      action: 'UNAUTHORIZED_ACCESS',
      user: req.user?._id,
      details,
      ip: req.ip,
    });
  } catch (_) {
    // fail silently
  }
};

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    await safeLogUnauthorized(req, 'Missing Bearer token');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      await safeLogUnauthorized(req, 'Token valid but user not found');
      return res.status(401).json({ message: 'Not authorized (user missing)' });
    }

    req.user = user;
    return next();
  } catch (error) {
    await safeLogUnauthorized(req, `Invalid token: ${error.message}`);
    return res.status(401).json({ message: 'Not authorized (token invalid)' });
  }
};

module.exports = { protect };
