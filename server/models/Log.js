// server/models/Log.js
const mongoose = require('mongoose');

const logSchema = mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN_ATTEMPT',
        'DELETE_LISTING',
        'EMAIL_SENT',
        'SYSTEM_ERROR',
        'UNAUTHORIZED_ACCESS', // ✅ added
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    details: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Log', logSchema);
