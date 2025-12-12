const express = require('express');
const router = express.Router();
const { createProperty, getProperties } = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProperties);
router.post('/', protect, upload.single('image'), createProperty);

module.exports = router;