const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  priceUnit: {
    type: String,
    enum: ['total', 'per sq ft'],
    default: 'total'
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['apartment', 'house', 'villa', 'plot', 'commercial', 'office space', 'shop']
  },
  listingType: {
    type: String,
    required: [true, 'Listing type is required'],
    enum: ['sale', 'rent']
  },
  bedrooms: {
    type: Number,
    min: 0
  },
  bathrooms: {
    type: Number,
    min: 0
  },
  furnishing: {
    type: String,
    enum: ['unfurnished', 'semi-furnished', 'fully-furnished']
  },
  constructionStatus: {
    type: String,
    enum: ['under construction', 'ready to move']
  },
  area: {
    type: Number,
    required: [true, 'Area is required']
  },
  areaUnit: {
    type: String,
    enum: ['sq ft', 'sq m', 'acres', 'hectares'],
    default: 'sq ft'
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required']
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  amenities: [String],
  images: [{
    url: String,
    public_id: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create index for location coordinates for geospatial queries
PropertySchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Property', PropertySchema);
