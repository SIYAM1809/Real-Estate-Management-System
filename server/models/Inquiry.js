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
    // --- NEW FIELDS FOR APPOINTMENTS ---
    appointmentDate: {
      type: String, // Storing as String (YYYY-MM-DD) is safer for beginners than Date objects
    },
    appointmentTime: {
      type: String, 
    },
    type: {
      type: String,
      enum: ['message', 'appointment'], // Only allows these two values
      default: 'message',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);