const express = require('express');
const router = express.Router();
const { getPendingProperties, approveProperty, rejectProperty } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// All routes here are protected AND admin-only
router.get('/pending', protect, adminOnly, getPendingProperties);
router.put('/approve/:id', protect, adminOnly, approveProperty);
router.put('/reject/:id', protect, adminOnly, rejectProperty);

module.exports = router;