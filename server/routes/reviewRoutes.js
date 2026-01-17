// server/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();

const {
  createReview,
  getPropertyReviews,
  getMyReviews,
  adminGetReviews,
  adminUpdateReviewStatus,
  adminDeleteReview,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public
router.get('/property/:propertyId', getPropertyReviews);

// Buyer
router.post('/', protect, authorize('buyer'), createReview);
router.get('/my', protect, authorize('buyer'), getMyReviews);

// Admin
router.get('/admin', protect, authorize('admin'), adminGetReviews);
router.put('/:id/status', protect, authorize('admin'), adminUpdateReviewStatus);
router.delete('/:id', protect, authorize('admin'), adminDeleteReview);

module.exports = router;
