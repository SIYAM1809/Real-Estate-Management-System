// server/routes/inquiryRoutes.js
const express = require('express');
const router = express.Router();

const {
  createInquiry,
  getMyInquiries,
  respondToAppointment,
  getMyRequests,
} = require('../controllers/inquiryController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Buyer only: send inquiry (message/appointment request)
router.post('/', protect, authorize('buyer'), createInquiry);

// Seller only: inbox (inquiries sent to seller)
router.get('/my-inquiries', protect, authorize('seller'), getMyInquiries);

// Seller only: respond to appointment requests
router.put('/:id/appointment-response', protect, authorize('seller'), respondToAppointment);

// Buyer only: view their sent inquiries/appointments (for “My Requests” UI)
router.get('/my-requests', protect, authorize('buyer'), getMyRequests);

module.exports = router;
