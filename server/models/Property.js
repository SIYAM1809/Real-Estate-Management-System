// server/models/Property.js
const mongoose = require('mongoose');

const propertySchema = mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Please add a title'], trim: true },
    description: { type: String, required: [true, 'Please add a description'] },
    price: { type: Number, required: [true, 'Please add a price'] },

    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
    },

    category: { type: String, required: [true, 'Please select a category'] },

    images: [{ public_id: String, url: String }],

    // ✅ Land-only UI: rooms should NOT be required
    // Keep it for backward compatibility; default 0 for land listings
    rooms: { type: Number, default: 0, min: 0 },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    adminComment: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
