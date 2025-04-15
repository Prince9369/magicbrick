const express = require('express');
const router = express.Router();
const {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getUserProperties,
  toggleFeatured,
  toggleVerified
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProperties);

// Protected routes
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

// User properties route - must be before /:id route to avoid conflict
router.get('/user/properties', protect, getUserProperties);

// Get property by ID - must be after all specific routes
router.get('/:id', getProperty);

// Admin routes
router.put('/:id/featured', protect, authorize('admin'), toggleFeatured);
router.put('/:id/verify', protect, authorize('admin'), toggleVerified);

module.exports = router;
