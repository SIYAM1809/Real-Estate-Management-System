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

const getProperties = async (req, res) => {
  const properties = await Property.find({ status: 'approved' }).populate('seller', 'name email');
  res.json(properties);
};

module.exports = { createProperty, getProperties };