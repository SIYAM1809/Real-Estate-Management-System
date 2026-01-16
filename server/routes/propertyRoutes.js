// server/routes/propertyRoutes.js
const express = require('express');
const router = express.Router();

const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getAllPropertiesAdmin,
  updateStatus,
} = require('../controllers/propertyController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public
router.route('/').get(getProperties);

// Seller: create property (pending approval)
router.post('/', protect, authorize('seller'), upload.single('image'), createProperty);

// Seller: view my listings
router.get('/my-listings', protect, authorize('seller'), getMyProperties);

// Admin: view all properties + approve/reject
router.get('/admin-all', protect, authorize('admin'), getAllPropertiesAdmin);
router.put('/:id/status', protect, authorize('admin'), updateStatus);

// Public: view one property
router.get('/:id', getProperty);

// Seller: update/delete own property (controller also checks ownership)
router.put('/:id', protect, authorize('seller'), updateProperty);
router.delete('/:id', protect, authorize('seller'), deleteProperty);

module.exports = router;
