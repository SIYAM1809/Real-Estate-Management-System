// server/controllers/inquiryController.js
const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Create new inquiry (Message or Appointment)
// @route   POST /api/inquiries
// @access  Private (Buyer only)
const createInquiry = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can send inquiries.' });
    }

    const { message, propertyId, requestedDate, requestedTime, type } = req.body;

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Valid propertyId is required.' });
    }

    const inquiryType = type === 'appointment' ? 'appointment' : 'message';

    if (!message || String(message).trim().length < 2) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    // load only what we need
    const property = await Property.findById(propertyId).select('seller status');
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    if (property.status !== 'approved') {
      return res.status(403).json({ message: 'You can only inquire about approved properties.' });
    }

    if (String(property.seller) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot send an inquiry to your own property.' });
    }

    // Appointment request: buyer may provide preferences, not final schedule
    let appointmentPayload = undefined;
    let status = 'new';

    if (inquiryType === 'appointment') {
      status = 'pending';

      // Preferences are optional (seller will allocate final). Still validate if provided.
      if ((requestedDate && !/^\d{4}-\d{2}-\d{2}$/.test(String(requestedDate))) ||
          (requestedTime && !/^\d{2}:\d{2}$/.test(String(requestedTime)))) {
        return res.status(400).json({ message: 'Invalid requestedDate/requestedTime format.' });
      }

      appointmentPayload = {
        requestedDate: requestedDate ? String(requestedDate) : undefined,
        requestedTime: requestedTime ? String(requestedTime) : undefined,
      };
    }

    // Anti-spam: one per buyer+property+type (enforced by unique index too)
    const existingInquiry = await Inquiry.findOne({
      buyer: req.user._id,
      property: propertyId,
      type: inquiryType,
    });

    if (existingInquiry) {
      return res.status(400).json({
        message: `You have already sent a ${inquiryType} request for this property.`,
      });
    }

    const inquiry = await Inquiry.create({
      buyer: req.user._id,
      seller: property.seller,
      property: propertyId,
      type: inquiryType,
      status,
      message: String(message).trim(),
      email: req.user.email,
      appointment: appointmentPayload,
    });

    return res.status(201).json(inquiry);
  } catch (error) {
    // handle unique index nicely
    if (error && error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate inquiry: you already sent this type of request for this property.',
      });
    }
    console.error('INQUIRY ERROR:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Seller inbox (inquiries addressed to seller)
// @route   GET /api/inquiries/my-inquiries
// @access  Private (Seller only)
const getMyInquiries = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can view inquiries.' });
    }

    const inquiries = await Inquiry.find({ seller: req.user._id })
      .populate('buyer', 'name email')
      .populate('property', 'title')
      .sort({ createdAt: -1 });

    return res.json(inquiries);
  } catch (error) {
    console.error('GET INQUIRIES ERROR:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Seller responds to appointment (propose/confirm/reject)
// @route   PUT /api/inquiries/:id/appointment-response
// @access  Private (Seller only)
const respondToAppointment = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can respond to appointments.' });
    }

    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Valid inquiry id is required.' });
    }

    const { action, scheduledDate, scheduledTime, meetingPlace, sellerNote } = req.body;

    // action: propose | confirm | reject
    const normalizedAction = String(action || '').trim().toLowerCase();
    if (!['propose', 'confirm', 'reject'].includes(normalizedAction)) {
      return res.status(400).json({ message: 'action must be propose, confirm, or reject.' });
    }

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    if (String(inquiry.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: not your inquiry.' });
    }

    if (inquiry.type !== 'appointment') {
      return res.status(400).json({ message: 'This inquiry is not an appointment request.' });
    }

    // If seller is proposing or confirming, require schedule + place
    if (normalizedAction === 'propose' || normalizedAction === 'confirm') {
      if (!scheduledDate || !scheduledTime || !meetingPlace) {
        return res.status(400).json({
          message: 'scheduledDate, scheduledTime, and meetingPlace are required.',
        });
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(scheduledDate))) {
        return res.status(400).json({ message: 'scheduledDate must be YYYY-MM-DD.' });
      }
      if (!/^\d{2}:\d{2}$/.test(String(scheduledTime))) {
        return res.status(400).json({ message: 'scheduledTime must be HH:mm.' });
      }

      inquiry.appointment = inquiry.appointment || {};
      inquiry.appointment.scheduledDate = String(scheduledDate);
      inquiry.appointment.scheduledTime = String(scheduledTime);
      inquiry.appointment.meetingPlace = String(meetingPlace).trim();
      inquiry.appointment.sellerNote = sellerNote ? String(sellerNote).trim() : undefined;
      inquiry.appointment.respondedAt = new Date();

      inquiry.status = normalizedAction === 'confirm' ? 'confirmed' : 'seller_proposed';
    }

    if (normalizedAction === 'reject') {
      inquiry.appointment = inquiry.appointment || {};
      inquiry.appointment.sellerNote = sellerNote ? String(sellerNote).trim() : 'Rejected by seller';
      inquiry.appointment.respondedAt = new Date();
      inquiry.status = 'rejected';
    }

    await inquiry.save();

    return res.json({ message: 'Appointment updated', inquiry });
  } catch (error) {
    console.error('RESPOND APPOINTMENT ERROR:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Buyer view their own sent inquiries (optional but useful for UI)
// @route   GET /api/inquiries/my-requests
// @access  Private (Buyer only)
const getMyRequests = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can view their requests.' });
    }

    const inquiries = await Inquiry.find({ buyer: req.user._id })
      .populate('seller', 'name email')
      .populate('property', 'title')
      .sort({ createdAt: -1 });

    return res.json(inquiries);
  } catch (error) {
    console.error('GET MY REQUESTS ERROR:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  respondToAppointment,
  getMyRequests,
};
