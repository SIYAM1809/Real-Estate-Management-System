// server/controllers/propertyController.js
const Property = require('../models/Property');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Create a new property (seller submits -> pending)
// @route   POST /api/properties
// @access  Private (seller/admin via middleware)
const createProperty = async (req, res) => {
  try {
    const { title, description, price, address, city, category, rooms } = req.body;

    const images = [];

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'real_estate_properties',
      });

      images.push({ url: result.secure_url, public_id: result.public_id });
    }

    const property = await Property.create({
      seller: req.user.id,
      title,
      description,
      price,
      location: { address, city },
      category,
      rooms,
      images, // ✅ empty array if no upload
      status: 'pending',
      adminComment: '',
    });

    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all approved properties with filters
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const query = { status: 'approved' };

    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }

    if (req.query.city) {
      query['location.city'] = { $regex: req.query.city, $options: 'i' };
    }

    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    if (req.query.maxPrice) {
      const maxPrice = Number(req.query.maxPrice);
      if (!Number.isNaN(maxPrice)) query.price = { $lte: maxPrice };
    }

    const properties = await Property.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('seller', 'name email');

    if (!property) return res.status(404).json({ message: 'Property not found' });

    res.json(property);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: 'Property not found' });
  }
};

// @desc    Update property (seller)
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // ✅ Only allow editable fields
    const allowed = ['title', 'description', 'price', 'location', 'category', 'rooms', 'isAvailable'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // ✅ If seller edits, it goes back to pending for re-approval
    updates.status = 'pending';
    updates.adminComment = '';

    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.json(updatedProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get properties for the logged-in seller
// @route   GET /api/properties/my-listings
// @access  Private
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Seller owns it OR Admin)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const isOwner = property.seller.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    // ✅ Seller can delete own listing, Admin can delete any listing
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Not allowed to delete this listing' });
    }

    await property.deleteOne();
    res.json({ id: req.params.id, message: 'Property deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Get ALL properties (Admin)
// @route   GET /api/properties/admin-all
// @access  Private/Admin
const getAllPropertiesAdmin = async (req, res) => {
  try {
    const properties = await Property.find({})
      .populate('seller', 'name email')
      // ✅ Pending first using explicit order
      .sort({ createdAt: -1 });

    // ✅ Stable pending-first ordering in code (no guessing with string sort)
    const rank = { pending: 0, rejected: 1, approved: 2 };
    properties.sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9));

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update property status (Approve/Reject + optional comment)
// @route   PUT /api/properties/:id/status
// @access  Private/Admin
const updateStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    property.status = status;
    if (adminComment !== undefined) property.adminComment = String(adminComment);

    await property.save();
    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getAllPropertiesAdmin,
  updateStatus,
};
