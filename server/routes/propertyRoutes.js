const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getAllPropertiesAdmin, // <--- Import
  updateStatus,          // <--- Import
} = require('../controllers/propertyController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // <--- 1. Import Multer

// Public & General Routes
router.route('/')
  .get(getProperties)
  // 2. THIS IS THE FIX: upload.single('image') allows the server to read the file
  .post(protect, upload.single('image'), createProperty); 

// Seller Route
router.get('/my-listings', protect, getMyProperties);

// --- ADMIN ROUTES ---
router.get('/admin-all', protect, getAllPropertiesAdmin);
router.put('/:id/status', protect, updateStatus);

// ID Specific Routes
router
  .route('/:id')
  .get(getProperty)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

module.exports = router;