const Property = require('../models/Property');
const User = require('../models/User');

// @desc    Get all properties waiting for approval
// @route   GET /api/admin/pending
// @access  Private (Admin)
const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' }).populate('seller', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve a property
// @route   PUT /api/admin/approve/:id
// @access  Private (Admin)
const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      property.status = 'approved';
      await property.save();
      res.json({ message: 'Property Approved' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reject a property
// @route   PUT /api/admin/reject/:id
// @access  Private (Admin)
const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      property.status = 'rejected';
      await property.save();
      res.json({ message: 'Property Rejected' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPendingProperties,
  approveProperty,
  rejectProperty,
};