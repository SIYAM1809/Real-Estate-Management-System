// server/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();

const {
  createReview,
  getApprovedReviews,
  getPendingReviews,
  updateReviewStatus,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Buyer: create review
router.post('/', protect, authorize('buyer'), createReview);

// Public: approved reviews for a property
router.get('/property/:propertyId', getApprovedReviews);

// Admin: pending reviews + status update
router.get('/pending', protect, authorize('admin'), getPendingReviews);
router.put('/:id/status', protect, authorize('admin'), updateReviewStatus);

module.exports = router;
