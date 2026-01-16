// server/controllers/inquiryController.js
const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Create new inquiry (Message or Appointment)
// @route   POST /api/inquiries
// @access  Private (Buyer only)
const createInquiry = async (req, res) => {
  try {
    // ✅ Extra safety (route already blocks, but controller should also be safe)
    if (!req.user || req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can send inquiries.' });
    }

    const { message, propertyId, appointmentDate, appointmentTime, type } = req.body;

    if (!propertyId) {
      return res.status(400).json({ message: 'propertyId is required.' });
    }

    const inquiryType = type === 'appointment' ? 'appointment' : 'message';

    // ✅ Check property exists (and get seller from DB — prevents tampering)
    const property = await Property.findById(propertyId).populate('seller', 'name email');
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // ✅ Strong rule: only approved properties can be contacted
    if (property.status !== 'approved') {
      return res.status(403).json({ message: 'You can only inquire about approved properties.' });
    }

    // ✅ Prevent buyer from sending inquiry to own listing (if buyer is also seller)
    if (String(property.seller?._id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot send an inquiry to your own property.' });
    }

    // ✅ Appointment validation
    if (inquiryType === 'appointment') {
      if (!appointmentDate || !appointmentTime) {
        return res.status(400).json({ message: 'Appointment date and time are required.' });
      }
    }

    if (!message || String(message).trim().length < 2) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    // ✅ Anti-spam: one inquiry per buyer per property (keep your current rule)
    const existingInquiry = await Inquiry.findOne({
      buyer: req.user.id,
      property: propertyId,
    });

    if (existingInquiry) {
      return res.status(400).json({
        message: 'You have already sent an inquiry/request for this property.',
      });
    }

    // ✅ Create inquiry (seller + email derived safely)
    const inquiry = await Inquiry.create({
      buyer: req.user.id,
      seller: property.seller._id,
      property: propertyId,
      message: String(message).trim(),
      email: req.user.email, // ✅ from token/user, not body
      appointmentDate: inquiryType === 'appointment' ? appointmentDate : undefined,
      appointmentTime: inquiryType === 'appointment' ? appointmentTime : undefined,
      type: inquiryType,
    });

    return res.status(201).json(inquiry);
  } catch (error) {
    console.error('INQUIRY ERROR:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get inquiries for the logged-in seller (Seller Inbox)
// @route   GET /api/inquiries/my-inquiries
// @access  Private (Seller only)
const getMyInquiries = async (req, res) => {
  try {
    // ✅ Extra safety
    if (!req.user || req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can view inquiries.' });
    }

    const inquiries = await Inquiry.find({ seller: req.user.id })
      .populate('buyer', 'name email')
      .populate('property', 'title')
      .sort({ createdAt: -1 });

    return res.json(inquiries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
};
