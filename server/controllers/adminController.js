// server/controllers/adminController.js
const Property = require('../models/Property');

// @desc    Get all properties waiting for approval
// @route   GET /api/admin/pending
// @access  Private (Admin)
const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' }).populate('seller', 'name email');
    return res.json(properties);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve a property
// @route   PUT /api/admin/approve/:id
// @access  Private (Admin)
const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.status = 'approved';
    await property.save();

    return res.json({ message: 'Property Approved', property });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reject a property
// @route   PUT /api/admin/reject/:id
// @access  Private (Admin)
const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.status = 'rejected';
    await property.save();

    return res.json({ message: 'Property Rejected', property });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPendingProperties,
  approveProperty,
  rejectProperty,
};
