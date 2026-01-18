// server/controllers/inquiryController.js
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

    const {
      message,
      propertyId,
      type,
      appointmentDate,
      appointmentTime,
      requestedPlace, // ✅ NEW (optional)
    } = req.body;

    if (!propertyId) {
      return res.status(400).json({ message: 'propertyId is required.' });
    }

    const inquiryType = type === 'appointment' ? 'appointment' : 'message';

    const property = await Property.findById(propertyId).populate('seller', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found.' });

    if (property.status !== 'approved') {
      return res.status(403).json({ message: 'You can only inquire about approved properties.' });
    }

    if (String(property.seller?._id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot send an inquiry to your own property.' });
    }

    if (!message || String(message).trim().length < 2) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    // ✅ Appointment validation
    if (inquiryType === 'appointment') {
      if (!appointmentDate || !appointmentTime) {
        return res.status(400).json({ message: 'Appointment date and time are required.' });
      }
    }

    // ✅ Anti-spam but NOT a dead-end:
    // - If latest inquiry exists and is still active => block
    // - If latest inquiry was rejected => allow buyer to create a new one
    const latest = await Inquiry.findOne({
      buyer: req.user.id,
      property: propertyId,
    }).sort({ createdAt: -1 });

    if (latest) {
      const activeStatuses = ['pending', 'proposed', 'buyer_accepted'];
      if (activeStatuses.includes(latest.status)) {
        return res.status(400).json({
          message: 'You already have an active inquiry/request for this property.',
        });
      }
      // If seller_rejected or buyer_rejected => allow new request
    }

    const cleanMsg = String(message).trim();

    const doc = {
      buyer: req.user.id,
      seller: property.seller._id,
      property: propertyId,
      message: cleanMsg,
      email: req.user.email,
      type: inquiryType,
      status: 'pending',
    };

    if (inquiryType === 'appointment') {
      // Backward compatible fields
      doc.appointmentDate = appointmentDate;
      doc.appointmentTime = appointmentTime;

      // New structured fields
      doc.appointment = {
        requestedDate: appointmentDate,
        requestedTime: appointmentTime,
        requestedPlace: requestedPlace ? String(requestedPlace).trim() : '',
      };
    }

    const inquiry = await Inquiry.create(doc);
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
    if (!req.user || req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can view inquiries.' });
    }

    const inquiries = await Inquiry.find({ seller: req.user.id })
      .populate('buyer', 'name email role')
      .populate('property', 'title images location price rooms')
      .sort({ createdAt: -1 });

    return res.json(inquiries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get inquiries sent by logged-in buyer
// @route   GET /api/inquiries/my-sent
// @access  Private (Buyer only)
const getMySentInquiries = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can view sent inquiries.' });
    }

    const inquiries = await Inquiry.find({ buyer: req.user.id })
      .populate('seller', 'name email role')
      .populate('property', 'title images location price rooms')
      .sort({ createdAt: -1 });

    return res.json(inquiries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Seller responds to appointment: propose / accept_requested / reject
// @route   PUT /api/inquiries/:id/seller-action
// @access  Private (Seller only)
const sellerActionOnAppointment = async (req, res) => {
  try {
    const { action, proposedDate, proposedTime, proposedPlace, sellerNote } = req.body;

    const inquiry = await Inquiry.findById(req.params.id).populate(
      'property',
      'title location'
    );

    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });

    if (String(inquiry.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    if (inquiry.type !== 'appointment') {
      return res.status(400).json({ message: 'This inquiry is not an appointment request.' });
    }

    // Do not allow changes after hard terminal states
    if (['buyer_accepted', 'buyer_rejected', 'seller_rejected'].includes(inquiry.status)) {
      return res.status(400).json({ message: `Cannot act on status: ${inquiry.status}` });
    }

    inquiry.appointment = inquiry.appointment || {};

    // read requested (from new fields or fallback old fields)
    const reqDate = inquiry.appointment.requestedDate || inquiry.appointmentDate || '';
    const reqTime = inquiry.appointment.requestedTime || inquiry.appointmentTime || '';

    const placeFallback =
      inquiry.property?.location?.address
        ? `${inquiry.property.location.address}${inquiry.property.location.city ? ', ' + inquiry.property.location.city : ''}`
        : '';

    if (action === 'reject') {
    const reason = sellerNote ? String(sellerNote).trim() : '';
    if (!reason) {
    return res.status(400).json({ message: 'Rejection reason is required.' });
  }

    inquiry.status = 'seller_rejected';
    inquiry.appointment.sellerNote = reason;
    await inquiry.save();
    return res.json({ message: 'Appointment rejected', inquiry });
  }


    if (action === 'accept_requested') {
      // Accept buyer requested slot; seller may set place/note
      inquiry.appointment.proposedDate = reqDate;
      inquiry.appointment.proposedTime = reqTime;
      inquiry.appointment.proposedPlace = proposedPlace
        ? String(proposedPlace).trim()
        : (placeFallback || '');

      inquiry.appointment.sellerNote = sellerNote ? String(sellerNote).trim() : '';

      // Keep backward compatibility fields aligned (optional)
      // (appointmentDate/time stay as buyer requested; proposed fields used for "final offer")
      inquiry.status = 'proposed';
      await inquiry.save();
      return res.json({ message: 'Accepted requested slot (pending buyer confirmation)', inquiry });
    }

    if (action === 'propose') {
      if (!proposedDate || !proposedTime) {
        return res.status(400).json({ message: 'proposedDate and proposedTime are required.' });
      }

      inquiry.appointment.proposedDate = String(proposedDate).trim();
      inquiry.appointment.proposedTime = String(proposedTime).trim();
      inquiry.appointment.proposedPlace = proposedPlace
        ? String(proposedPlace).trim()
        : (placeFallback || '');

      inquiry.appointment.sellerNote = sellerNote ? String(sellerNote).trim() : '';

      inquiry.status = 'proposed';
      await inquiry.save();
      return res.json({ message: 'Proposed appointment (pending buyer confirmation)', inquiry });
    }

    return res.status(400).json({ message: 'Invalid action.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Buyer accepts/rejects seller proposal
// @route   PUT /api/inquiries/:id/buyer-response
// @access  Private (Buyer only)
const buyerRespondToAppointment = async (req, res) => {
  try {
    const { action, buyerNote } = req.body; // action: 'accept' | 'reject'

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });

    if (String(inquiry.buyer) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    if (inquiry.type !== 'appointment') {
      return res.status(400).json({ message: 'Not an appointment inquiry.' });
    }

    if (inquiry.status !== 'proposed') {
      return res.status(400).json({ message: `Cannot respond at status: ${inquiry.status}` });
    }

    inquiry.appointment = inquiry.appointment || {};
    inquiry.appointment.buyerNote = buyerNote ? String(buyerNote).trim() : '';

    if (action === 'accept') {
      inquiry.status = 'buyer_accepted';
    } else if (action === 'reject') {
      inquiry.status = 'buyer_rejected';
    } else {
      return res.status(400).json({ message: 'Invalid action.' });
    }

    await inquiry.save();
    return res.json({ message: 'Response saved', inquiry });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  getMySentInquiries,
  sellerActionOnAppointment,
  buyerRespondToAppointment,
};
