const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
  },
  images: [
    {
      public_id: String,
      url: String
    }
  ],
  rooms: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);