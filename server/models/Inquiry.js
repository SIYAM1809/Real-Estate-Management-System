// server/models/Inquiry.js
const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema(
  {
    buyer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    seller: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    property: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Property', 
      required: true,
      index: true
    },

    message: { 
      type: String, 
      required: [true, 'Please add a message'],
      trim: true
    },
    
    email: { 
      type: String, 
      required: true,
      trim: true,
      lowercase: true
    },

    type: {
      type: String,
      enum: ['message', 'appointment'],
      default: 'message',
      index: true
    },

    // ✅ appointment workflow
    status: {
      type: String,
      enum: ['pending', 'proposed', 'seller_rejected', 'buyer_accepted', 'buyer_rejected'],
      default: 'pending',
      index: true
    },

    appointment: {
      // buyer request
      requestedDate: String,
      requestedTime: String,
      requestedPlace: String, // ✅ buyer optional

      // seller proposal / final offer
      proposedDate: String,
      proposedTime: String,
      proposedPlace: String,  // ✅ seller sets final place
      sellerNote: String,

      // buyer response note (optional)
      buyerNote: String,
    },
  },
  { timestamps: true }
);

// prevent duplicated spam per buyer+property+type (message vs appointment)
inquirySchema.index({ buyer: 1, property: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Inquiry', inquirySchema);