// server/routes/inquiryRoutes.js
const express = require('express');
const router = express.Router();

const { createInquiry, getMyInquiries } = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// ✅ Buyer only: send inquiry/message/appointment
router.post('/', protect, authorize('buyer'), createInquiry);

// ✅ Seller only: see inbox (inquiries sent to seller)
router.get('/my-inquiries', protect, authorize('seller'), getMyInquiries);

module.exports = router;
