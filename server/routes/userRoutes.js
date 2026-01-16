const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  toggleFavorite,
  getFavorites,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// ✅ Buyer-only
router.put('/favorites/:id', protect, authorize('buyer'), toggleFavorite);
router.get('/favorites', protect, authorize('buyer'), getFavorites);

module.exports = router;
