// server/middleware/roleMiddleware.js
const Log = require('../models/Log');

/**
 * authorize(...roles)
 * Usage: authorize('seller') or authorize('admin')
 */
const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // protect middleware must run first
      if (!req.user || !req.user.role) {
        await safeLogUnauthorized(req, 'Missing req.user or req.user.role');
        return res.status(401).json({ message: 'Not authorized' });
      }

      if (!allowedRoles.includes(req.user.role)) {
        await safeLogUnauthorized(
          req,
          `Forbidden role: ${req.user.role}. Allowed: ${allowedRoles.join(', ')}`
        );
        return res.status(403).json({ message: 'Forbidden: Insufficient role access' });
      }

      return next();
    } catch (err) {
      // If logging fails, don't crash the app
      return res.status(500).json({ message: 'Server Error' });
    }
  };
};

// Keep your existing style: adminOnly
const adminOnly = authorize('admin');

// ✅ Safe logging helper (won’t crash server if Log fails)
const safeLogUnauthorized = async (req, details) => {
  try {
    await Log.create({
      action: 'UNAUTHORIZED_ACCESS',
      user: req.user?._id,
      details,
      ip: req.ip,
    });
  } catch (e) {
    // fail silently
  }
};

module.exports = { authorize, adminOnly };
