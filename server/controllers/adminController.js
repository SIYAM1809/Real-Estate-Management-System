// server/controllers/adminController.js
const Property = require('../models/Property');
const User = require('../models/User');

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

    if (!property) return res.status(404).json({ message: 'Property not found' });

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

    if (!property) return res.status(404).json({ message: 'Property not found' });

    property.status = 'rejected';
    await property.save();

    return res.json({ message: 'Property Rejected', property });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ NEW
// @desc    Get all users separated into buyers/sellers/admins
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 });

    const buyers = users.filter((u) => u.role === 'buyer');
    const sellers = users.filter((u) => u.role === 'seller');
    const admins = users.filter((u) => u.role === 'admin');

    return res.json({ buyers, sellers, admins });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ NEW
// @desc    Delete a user (buyer/seller) - admin cannot delete self and cannot delete other admins
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const targetId = req.params.id;

    // prevent deleting self
    if (String(targetId) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // prevent deleting admins
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot be deleted.' });
    }

    await User.deleteOne({ _id: targetId });

    return res.json({ message: 'User deleted', id: targetId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPendingProperties,
  approveProperty,
  rejectProperty,

  // ✅ NEW exports
  getAllUsers,
  deleteUser,
};
