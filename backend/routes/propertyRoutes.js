const express = require('express');
const router = express.Router();
const Property = require('../models/propertyModel');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all properties (with optional filtering)
// @route   GET /api/properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, minPrice, maxPrice, propertyType, search } = req.query;
    const query = {};

    // Filter by city (case-insensitive regex)
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Filter by property type
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        const minVal = Number(minPrice);
        if (isNaN(minVal)) {
          return res.status(400).json({ message: 'minPrice must be a valid number' });
        }
        query.price.$gte = minVal;
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        const maxVal = Number(maxPrice);
        if (isNaN(maxVal)) {
          return res.status(400).json({ message: 'maxPrice must be a valid number' });
        }
        query.price.$lte = maxVal;
      }
      // If empty query subkeys were assigned, clean them
      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    // General text search (on title/description/city/country)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.country': { $regex: search, $options: 'i' } },
      ];
    }

    // Retrieve properties and populate owner's public details
    const properties = await Property.find(query)
      .populate('owner', 'username email name phone avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(properties);
  } catch (error) {
    console.error('Fetch properties error:', error);
    res.status(500).json({ message: 'Server error retrieving properties' });
  }
});

// @desc    Get current user's listings
// @route   GET /api/properties/my-listings
// @access  Private
router.get('/my-listings', protect, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .populate('owner', 'username email name phone avatar')
      .sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Fetch my-listings error:', error);
    res.status(500).json({ message: 'Server error retrieving listings' });
  }
});

// @desc    Get a single property by ID
// @route   GET /api/properties/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'username email name phone avatar'
    );

    if (!property) {
      return res.status(404).json({ message: 'Property listing not found' });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error('Fetch property by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Property listing not found (invalid format)' });
    }
    res.status(500).json({ message: 'Server error retrieving property listing' });
  }
});

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, description, price, location, propertyType, imageUrls } = req.body;

  // Validate fields
  if (!title || !description || price === undefined || !location || !propertyType) {
    return res.status(400).json({ message: 'Please provide all required property details' });
  }

  const priceVal = Number(price);
  if (isNaN(priceVal) || priceVal < 0) {
    return res.status(400).json({ message: 'Price must be a valid positive number' });
  }

  if (!location.city || !location.country) {
    return res.status(400).json({ message: 'Location must contain both city and country' });
  }

  if (!['Apartment', 'House', 'Studio'].includes(propertyType)) {
    return res.status(400).json({ message: 'Property type must be Apartment, House, or Studio' });
  }

  // Format sanitation for imageUrls: ensure it is array and cleanup empty ones
  let sanitizedUrls = [];
  if (Array.isArray(imageUrls)) {
    sanitizedUrls = imageUrls.map(url => String(url).trim()).filter(url => url.length > 0);
  }

  try {
    const property = await Property.create({
      title,
      description,
      price: priceVal,
      location: {
        city: location.city.trim(),
        country: location.country.trim(),
      },
      propertyType,
      imageUrls: sanitizedUrls,
      owner: req.user._id,
    });

    const populatedProperty = await Property.findById(property._id).populate(
      'owner',
      'username email name phone avatar'
    );

    res.status(201).json(populatedProperty);
  } catch (error) {
    console.error('Create property error:', error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a property listing
// @route   PUT /api/properties/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property listing not found' });
    }

    // Owner Verification directly at server level (Secure Route Guards)
    if (property.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You do not own this property listing' });
    }

    const { title, description, price, location, propertyType, imageUrls } = req.body;

    // Field updates and validations
    if (title !== undefined) property.title = title;
    if (description !== undefined) property.description = description;
    
    if (price !== undefined) {
      const priceVal = Number(price);
      if (isNaN(priceVal) || priceVal < 0) {
        return res.status(400).json({ message: 'Price must be a valid positive number' });
      }
      property.price = priceVal;
    }

    if (location !== undefined) {
      if (!location.city || !location.country) {
        return res.status(400).json({ message: 'Location must contain both city and country' });
      }
      property.location = {
        city: location.city.trim(),
        country: location.country.trim(),
      };
    }

    if (propertyType !== undefined) {
      if (!['Apartment', 'House', 'Studio'].includes(propertyType)) {
        return res.status(400).json({ message: 'Property type must be Apartment, House, or Studio' });
      }
      property.propertyType = propertyType;
    }

    if (imageUrls !== undefined) {
      if (Array.isArray(imageUrls)) {
        property.imageUrls = imageUrls.map(url => String(url).trim()).filter(url => url.length > 0);
      } else {
        return res.status(400).json({ message: 'imageUrls must be an array of strings' });
      }
    }

    const updatedProperty = await property.save();
    
    const populatedProperty = await Property.findById(updatedProperty._id).populate(
      'owner',
      'username email name phone avatar'
    );

    res.status(200).json(populatedProperty);
  } catch (error) {
    console.error('Update property error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Property listing not found (invalid ID format)' });
    }
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a property listing
// @route   DELETE /api/properties/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property listing not found' });
    }

    // Owner Verification directly at server level (Secure Route Guards)
    if (property.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You do not own this property listing' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Property listing deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete property error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Property listing not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server error deleting property' });
  }
});

module.exports = router;
