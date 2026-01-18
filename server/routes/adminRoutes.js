// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const {
  getPendingProperties,
  approveProperty,
  rejectProperty,

  // ✅ NEW: users management
  getAllUsers,
  deleteUser,
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Properties approval
router.get('/pending', protect, adminOnly, getPendingProperties);
router.put('/approve/:id', protect, adminOnly, approveProperty);
router.put('/reject/:id', protect, adminOnly, rejectProperty);

// ✅ Users management
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
