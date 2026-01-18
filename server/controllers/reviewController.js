// server/controllers/reviewController.js
const Review = require('../models/Review');
const Property = require('../models/Property');

// Buyer: create review (pending)
const createReview = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can post reviews.' });
    }

    const { propertyId, rating, comment } = req.body;

    if (!propertyId) return res.status(400).json({ message: 'propertyId is required.' });
    if (!rating) return res.status(400).json({ message: 'rating is required.' });

    const parsedRating = Number(rating);
    if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: 'rating must be between 1 and 5.' });
    }

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found.' });

    // Optional rule: only approved properties can be reviewed
    if (property.status !== 'approved') {
      return res.status(403).json({ message: 'You can only review approved properties.' });
    }

    // One review per buyer per property
    const exists = await Review.findOne({ property: propertyId, buyer: req.user._id });
    if (exists) return res.status(400).json({ message: 'You already reviewed this property.' });

    const newReview = await Review.create({
      property: propertyId,
      buyer: req.user._id,
      rating: parsedRating,
      comment: (comment || '').trim(),
      status: 'pending',
    });

    return res.status(201).json(newReview);
  } catch (err) {
    console.error('CREATE REVIEW ERROR:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Public: get approved reviews for property
const getApprovedReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const reviews = await Review.find({ property: propertyId, status: 'approved' })
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });

    const count = reviews.length;
    const average =
      count === 0
        ? 0
        : Number((reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1));

    return res.json({ reviews, count, average });
  } catch (err) {
    console.error('GET APPROVED REVIEWS ERROR:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Admin: pending reviews
const getPendingReviews = async (req, res) => {
  try {
    // Route is already authorize('admin'), but keep it safe
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only.' });
    }

    const reviews = await Review.find({ status: 'pending' })
      .populate('buyer', 'name email')
      .populate('property', 'title')
      .sort({ createdAt: -1 });

    return res.json(reviews);
  } catch (err) {
    console.error('GET PENDING REVIEWS ERROR:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Admin: approve/reject
const updateReviewStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only.' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use approved or rejected.' });
    }

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.status = status;
    await review.save();

    return res.json({ message: `Review ${status}`, review });
  } catch (err) {
    console.error('UPDATE REVIEW STATUS ERROR:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createReview,
  getApprovedReviews,
  getPendingReviews,
  updateReviewStatus,
};
