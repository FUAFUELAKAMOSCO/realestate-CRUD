const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Property price is required'],
      min: [0, 'Price must be a positive number'],
    },
    location: {
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
      },
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: {
        values: ['Apartment', 'House', 'Studio'],
        message: 'Property type must be Apartment, House, or Studio',
      },
    },
    imageUrls: {
      type: [String],
      default: [],
      validate: {
        validator: function (val) {
          // Check that all image URLs are non-empty strings
          return val.every(url => url && typeof url === 'string' && url.trim().length > 0);
        },
        message: 'Image URLs must be valid non-empty strings',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Property', propertySchema);
