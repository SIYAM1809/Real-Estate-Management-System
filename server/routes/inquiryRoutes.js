// server/routes/inquiryRoutes.js
const express = require('express');
const router = express.Router();

const {
  createInquiry,
  getMyInquiries,
  getMySentInquiries,
  sellerActionOnAppointment,
  buyerRespondToAppointment,
} = require('../controllers/inquiryController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// ✅ Buyer only: send inquiry/message/appointment
router.post('/', protect, authorize('buyer'), createInquiry);

// ✅ Seller only: see inbox (inquiries sent to seller)
router.get('/my-inquiries', protect, authorize('seller'), getMyInquiries);

// ✅ Buyer only: see what buyer sent (so buyer can accept/reject seller proposal)
router.get('/my-sent', protect, authorize('buyer'), getMySentInquiries);

// ✅ Seller only: propose/accept_requested/reject appointment
router.put('/:id/seller-action', protect, authorize('seller'), sellerActionOnAppointment);

// ✅ Buyer only: accept/reject seller proposal
router.put('/:id/buyer-response', protect, authorize('buyer'), buyerRespondToAppointment);

module.exports = router;
