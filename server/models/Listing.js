const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  // Property Basics - Handle both form and schema field names
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Residential', 'Commercial', 'Agricultural'],
    trim: true
  },
  listingFor: {
    type: String,
    required: [true, 'Listing type is required'],
    enum: ['Sell', 'Rent', 'PG', 'Flatmate'],
    trim: true
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['Apartment', 'Villa', 'Builder Floor', 'Plot', 'Studio Apartment', 'Farm House'],
    trim: true
  },
  availableFrom: {
    type: String, // Using String to match form's date format
    required: [true, 'Possession date is required'], // This is the possessionDate from form
    trim: true
  },

  // Location Details
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  location: {  // This maps to locality from the form
    type: String,
    required: [true, 'Locality is required'], // This is locality from the form
    trim: true
  },
  projectName: {
    type: String,
    required: false,
    trim: true
  },

  // Property Configuration
  unitType: {
    type: String,
    required: [true, 'Unit type is required'],
    enum: ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'],
    trim: true
  },
  builtUpArea: {
    type: Number,
    required: [true, 'Built-up area is required'],
    min: 0
  },
  carpetArea: {
    type: Number,
    required: false,
    min: 0
  },

  // Media - Handle both form field names
  images: [{  // This maps to photos from the form
    type: String,
    required: [true, 'At least one image is required']
  }],

  // Pricing & Availability
  price: {  // This maps to salePrice from the form
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  negotiable: {  // This maps to priceNegotiable from the form
    type: Boolean,
    required: false,
    default: false
  },

  // Additional Information
  description: {  // This maps to aboutProperty from the form
    type: String,
    required: [true, 'Property description is required for Quikr posting and must be at least 30 characters long'],
    minlength: [30, 'Property description is required for Quikr posting and must be at least 30 characters long'],
    trim: true
  },
  furnishing: {
    type: String,
    required: [true, 'Furnishing status is required'],
    enum: ['Unfurnished', 'Semi Furnished', 'Fully Furnished'],
    trim: true
  },
  bathrooms: {
    type: String,
    required: [true, 'Number of bathrooms is required'],
    enum: ['1', '2', '3', '4', '4+'],
    trim: true
  },

  // Additional Details
  balconies: {
    type: String,
    required: false,
    default: '0',
    trim: true
  },
  societyAmenities: [{
    type: String,
    required: false
  }],
  direction: {
    type: String,
    required: false,
    default: 'NA',
    trim: true
  },
  parking: {
    type: String,
    required: false,
    default: 'NA',
    trim: true
  },

  // Agent/Contact Details - Handle form field names
  ownerType: {  // This maps to userType from the form
    type: String,
    required: [true, 'User type is required'],
    enum: ['Owner', 'Agent', 'Builder'],
    trim: true
  },
  name: {  // This maps to fullName from the form
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {  // This maps to emailAddress from the form
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  mobile: {  // This maps to mobileNumber from the form
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },

  // Optional Services - Handle form field names
  services: {
    painting: {  // This maps to needPaintingService from the form
      type: Boolean,
      required: false,
      default: false
    },
    cleaning: {  // This maps to needHomeCleaningService from the form
      type: Boolean,
      required: false,
      default: false
    },
    pestControl: {  // This maps to needPestControlService from the form
      type: Boolean,
      required: false,
      default: false
    }
  },

  // Quikr Integration Tracking
  quikr: {
    status: {
      type: String,
      enum: ['pending', 'syncing', 'published', 'failed'],
      default: 'pending'
    },
    lastError: {
      type: String,
      required: false
    },
    publishedAt: {
      type: Date,
      required: false
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Listing', listingSchema);