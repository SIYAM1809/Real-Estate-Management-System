const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  toggleFavorite,
  getFavorites,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getMe);

// ✅ Buyer-only routes
router.put('/favorites/:id', protect, authorize('buyer'), toggleFavorite);
router.get('/favorites', protect, authorize('buyer'), getFavorites);

module.exports = router;