// server/models/User.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'], 
      default: 'buyer',
    },
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    }],
    // ✅ Change type to Number for timestamp
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Number }, // Changed from Date to Number
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);