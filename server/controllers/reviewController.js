// server/controllers/reviewController.js
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(String(id));

// @desc    Create a review (Buyer only, must have interaction)
// @route   POST /api/reviews
// @access  Private (Buyer)
const createReview = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can post reviews.' });
    }

    const { propertyId, rating, comment } = req.body;

    if (!propertyId || !isValidId(propertyId)) {
      return res.status(400).json({ message: 'Valid propertyId is required.' });
    }

    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const property = await Property.findById(propertyId).populate('seller', 'name email role');
    if (!property) return res.status(404).json({ message: 'Property not found.' });

    if (property.status !== 'approved') {
      return res.status(403).json({ message: 'You can only review approved properties.' });
    }

    // Buyer cannot review own listing
    if (String(property.seller?._id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot review your own property.' });
    }

    // ✅ Interaction gate: buyer must have an inquiry/appointment for this property
    const interacted = await Inquiry.exists({
      buyer: req.user._id,
      property: property._id,
    });

    if (!interacted) {
      return res.status(403).json({
        message: 'You can review only after contacting the seller (inquiry/appointment).',
      });
    }

    const review = await Review.create({
      buyer: req.user._id,
      seller: property.seller._id,
      property: property._id,
      rating: r,
      comment: String(comment || '').trim(),
      status: 'pending', // ✅ Admin moderation
    });

    return res.status(201).json(review);
  } catch (err) {
    // Duplicate review
    if (err?.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this property.' });
    }
    console.error('REVIEW CREATE ERROR:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get approved reviews for a property (Public)
// @route   GET /api/reviews/property/:propertyId
// @access  Public
const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!isValidId(propertyId)) {
      return res.status(400).json({ message: 'Invalid property id.' });
    }

    const reviews = await Review.find({ property: propertyId, status: 'approved' })
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });

    const count = reviews.length;
    const average =
      count === 0 ? 0 : Number((reviews.reduce((s, x) => s + (x.rating || 0), 0) / count).toFixed(2));

    return res.json({ count, average, reviews });
  } catch (err) {
    console.error('REVIEW FETCH ERROR:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get my reviews (Buyer)
// @route   GET /api/reviews/my
// @access  Private (Buyer)
const getMyReviews = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can view their reviews.' });
    }

    const reviews = await Review.find({ buyer: req.user._id })
      .populate('property', 'title')
      .sort({ createdAt: -1 });

    return res.json(reviews);
  } catch (err) {
    console.error('MY REVIEW ERROR:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Admin: get all reviews with filters
// @route   GET /api/reviews/admin?status=pending
// @access  Private (Admin)
const adminGetReviews = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only.' });
    }

    const q = {};
    if (req.query.status) q.status = req.query.status;
    if (req.query.propertyId && isValidId(req.query.propertyId)) q.property = req.query.propertyId;
    if (req.query.sellerId && isValidId(req.query.sellerId)) q.seller = req.query.sellerId;
    if (req.query.buyerId && isValidId(req.query.buyerId)) q.buyer = req.query.buyerId;

    // Optional rating filter
    const ratingMin = req.query.ratingMin ? Number(req.query.ratingMin) : null;
    const ratingMax = req.query.ratingMax ? Number(req.query.ratingMax) : null;
    if (Number.isFinite(ratingMin) || Number.isFinite(ratingMax)) {
      q.rating = {};
      if (Number.isFinite(ratingMin)) q.rating.$gte = ratingMin;
      if (Number.isFinite(ratingMax)) q.rating.$lte = ratingMax;
    }

    const reviews = await Review.find(q)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('property', 'title')
      .sort({ status: 1, createdAt: -1 });

    return res.json(reviews);
  } catch (err) {
    console.error('ADMIN REVIEWS ERROR:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Admin: approve/reject
// @route   PUT /api/reviews/:id/status
// @access  Private (Admin)
const adminUpdateReviewStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only.' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid review id.' });
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    review.status = status;
    await review.save();

    return res.json(review);
  } catch (err) {
    console.error('UPDATE REVIEW STATUS ERROR:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Admin: delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin)
const adminDeleteReview = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only.' });
    }

    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid review id.' });

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    await review.deleteOne();
    return res.json({ id });
  } catch (err) {
    console.error('DELETE REVIEW ERROR:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
  getMyReviews,
  adminGetReviews,
  adminUpdateReviewStatus,
  adminDeleteReview,
};
