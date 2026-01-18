// server/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();

const {
  createReview,
  getApprovedReviews,
  getPendingReviews,
  adminGetReviews,
  updateReviewStatus,
  deleteReview,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Buyer: create review
router.post('/', protect, authorize('buyer'), createReview);

// Public: approved reviews for a property
router.get('/property/:propertyId', getApprovedReviews);

// Admin: pending reviews (older route, keep it)
router.get('/pending', protect, authorize('admin'), getPendingReviews);

// ✅ Admin: all reviews filtered by status (frontend expects this)
router.get('/admin', protect, authorize('admin'), adminGetReviews);

// Admin: approve/reject
router.put('/:id/status', protect, authorize('admin'), updateReviewStatus);

// ✅ Admin: delete review (frontend expects this)
router.delete('/:id', protect, authorize('admin'), deleteReview);

module.exports = router;
