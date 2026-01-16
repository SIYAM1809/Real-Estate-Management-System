const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  toggleFavorite, // <--- MUST be imported
  getFavorites,   // <--- MUST be imported
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// 1. Existing Routes
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// 2. NEW FAVORITES ROUTES (The Missing Door)
router.put('/favorites/:id', protect, toggleFavorite); 
router.get('/favorites', protect, getFavorites);

module.exports = router;