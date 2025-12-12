// server/models/Log.js
const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  action: {
    type: String, 
    required: true, 
    enum: ['LOGIN_ATTEMPT', 'DELETE_LISTING', 'EMAIL_SENT', 'SYSTEM_ERROR'] 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // False because failed logins might not have a valid user ID
  },
  details: {
    type: String, // Description of what happened (e.g., "Failed login for email: abc@test.com")
    required: true
  },
  ip: {
    type: String // To track where the request came from
  }
}, {
  timestamps: true // Automatically creates 'createdAt' field
});

module.exports = mongoose.model('Log', logSchema);