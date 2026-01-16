const Property = require('../models/Property');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res) => {
  try {
    const { title, description, price, address, city, category, rooms } = req.body;

    let imageUrl = '';
    let imageId = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'real_estate_properties',
      });
      imageUrl = result.secure_url;
      imageId = result.public_id;
    }

    const property = await Property.create({
      seller: req.user.id,
      title,
      description,
      price,
      location: { address, city },
      category,
      rooms,
      images: [{ url: imageUrl, public_id: imageId }],
      status: 'pending',
    });

    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all approved properties with Filters
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    // Start with default query: Only show Approved properties
    let query = { status: 'approved' };

    // 1. Search by Keyword (Matches Title OR Description)
    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // 2. Filter by City
    if (req.query.city) {
      query['location.city'] = { $regex: req.query.city, $options: 'i' };
    }

    // 3. Filter by Category
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // 4. Filter by Max Price
    if (req.query.maxPrice) {
      query.price = { $lte: req.query.maxPrice };
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

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Property not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is the seller
    if (property.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

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
    // Find properties where seller == logged in user
    const properties = await Property.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is the seller
    if (property.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await property.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get ALL properties (Admin only)
// @route   GET /api/properties/admin-all
// @access  Private/Admin
const getAllPropertiesAdmin = async (req, res) => {
  try {
    // Return all properties, sorted by Pending first
    const properties = await Property.find({})
      .sort({ status: -1, createdAt: -1 }) // "Pending" starts with P, so it sorts near top
      .populate('seller', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update property status (Approve/Reject)
// @route   PUT /api/properties/:id/status
// @access  Private/Admin
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body; // Expect "approved" or "rejected"

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.status = status;
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// EXPORT ALL FUNCTIONS
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