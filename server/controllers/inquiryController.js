const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Create new inquiry (Message or Appointment)
// @route   POST /api/inquiries
// @access  Private
const createInquiry = async (req, res) => {
  try {
    // 1. We extract the new fields (appointmentDate, appointmentTime, type) here
    const { message, propertyId, sellerId, email, appointmentDate, appointmentTime, type } = req.body;

    // Check if buyer already messaged about this property (Prevent Spam)
    // NOTE: For testing, if you already messaged this house, this block might stop you.
    // If you want to allow multiple messages for testing, comment out this IF block.
    const existingInquiry = await Inquiry.findOne({
      buyer: req.user.id,
      property: propertyId,
    });

    if (existingInquiry) {
       // If you get "Server Error" it might actually be this returning a 400 that the frontend reads generically
       return res.status(400).json({ message: 'You have already sent an inquiry/request for this property.' });
    }

    // 2. Create the entry in Database
    const inquiry = await Inquiry.create({
      buyer: req.user.id,
      seller: sellerId,
      property: propertyId,
      message,
      email,
      appointmentDate,
      appointmentTime,
      type: type || 'message',
    });

    res.status(201).json(inquiry);
  } catch (error) {
    console.error("INQUIRY ERROR:", error); // This prints the real error to your Terminal
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get inquiries for the logged-in user (Seller Inbox)
// @route   GET /api/inquiries/my-inquiries
// @access  Private
const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ seller: req.user.id })
      .populate('buyer', 'name email')
      .populate('property', 'title')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
};