const express = require('express');
const router = express.Router();
const { createInquiry, getMyInquiries } = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');

// All inquiry routes are protected (Must be logged in)
router.post('/', protect, createInquiry);
router.get('/my-inquiries', protect, getMyInquiries);

module.exports = router;