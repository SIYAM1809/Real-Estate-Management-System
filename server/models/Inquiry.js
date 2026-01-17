const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },

    message: {
      type: String,
      required: [true, 'Please add a message'],
    },
    email: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ['message', 'appointment'],
      default: 'message',
    },

    // ✅ BACKWARD COMPATIBILITY (your existing UI uses these)
    appointmentDate: { type: String }, // buyer requested date
    appointmentTime: { type: String }, // buyer requested time

    // ✅ NEW: appointment state machine
    status: {
      type: String,
      enum: ['pending', 'proposed', 'seller_rejected', 'buyer_accepted', 'buyer_rejected'],
      default: 'pending',
    },

    // ✅ NEW: structured appointment data
    appointment: {
      // buyer request
      requestedDate: String,
      requestedTime: String,
      requestedPlace: String,

      // seller response / proposal
      proposedDate: String,
      proposedTime: String,
      proposedPlace: String,
      sellerNote: String,

      // buyer response note (optional)
      buyerNote: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
