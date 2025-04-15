const Property = require('../models/Property');
const cloudinary = require('../config/cloudinary');

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private
exports.createProperty = async (req, res) => {
  try {
    // Add owner to property
    req.body.owner = req.user._id;
    
    // Handle image uploads
    const imagePromises = [];
    if (req.body.images && req.body.images.length > 0) {
      for (const image of req.body.images) {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'magicbricks/properties'
        });
        
        imagePromises.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    }
    
    req.body.images = await Promise.all(imagePromises);
    
    // Create property
    const property = await Property.create(req.body);
    
    res.status(201).json({
      success: true,
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all properties with filters
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    // Build query
    let query = {};
    
    // Filter by listing type (sale/rent)
    if (req.query.listingType) {
      query.listingType = req.query.listingType;
    }
    
    // Filter by property type
    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType;
    }
    
    // Filter by city
    if (req.query.city) {
      query['location.city'] = { $regex: req.query.city, $options: 'i' };
    }
    
    // Filter by price range
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
    } else if (req.query.minPrice) {
      query.price = { $gte: req.query.minPrice };
    } else if (req.query.maxPrice) {
      query.price = { $lte: req.query.maxPrice };
    }
    
    // Filter by bedrooms
    if (req.query.bedrooms) {
      query.bedrooms = { $gte: req.query.bedrooms };
    }
    
    // Filter by area range
    if (req.query.minArea && req.query.maxArea) {
      query.area = { $gte: req.query.minArea, $lte: req.query.maxArea };
    } else if (req.query.minArea) {
      query.area = { $gte: req.query.minArea };
    } else if (req.query.maxArea) {
      query.area = { $lte: req.query.maxArea };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const properties = await Property.find(query)
      .populate('owner', 'name email profilePic')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count
    const total = await Property.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone profilePic');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Increment view count
    property.views += 1;
    await property.save();
    
    res.status(200).json({
      success: true,
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if user is property owner or admin
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }
    
    // Handle image uploads if any
    if (req.body.newImages && req.body.newImages.length > 0) {
      const imagePromises = [];
      for (const image of req.body.newImages) {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'magicbricks/properties'
        });
        
        imagePromises.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
      
      const newImages = await Promise.all(imagePromises);
      
      // Combine existing and new images
      req.body.images = [...property.images, ...newImages];
    }
    
    // Handle image deletions if any
    if (req.body.deleteImages && req.body.deleteImages.length > 0) {
      // Delete from cloudinary
      for (const publicId of req.body.deleteImages) {
        await cloudinary.uploader.destroy(publicId);
      }
      
      // Filter out deleted images
      req.body.images = property.images.filter(
        image => !req.body.deleteImages.includes(image.public_id)
      );
    }
    
    // Update property
    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if user is property owner or admin
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }
    
    // Delete images from cloudinary
    for (const image of property.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
    
    // Delete property
    await property.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user properties
// @route   GET /api/properties/user
// @access  Private
exports.getUserProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle property featured status (admin only)
// @route   PUT /api/properties/:id/featured
// @access  Private/Admin
exports.toggleFeatured = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Toggle featured status
    property.featured = !property.featured;
    await property.save();
    
    res.status(200).json({
      success: true,
      featured: property.featured
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle property verification status (admin only)
// @route   PUT /api/properties/:id/verify
// @access  Private/Admin
exports.toggleVerified = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Toggle verified status
    property.verified = !property.verified;
    await property.save();
    
    res.status(200).json({
      success: true,
      verified: property.verified
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
