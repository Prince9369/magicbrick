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
router.get('/:id', getProperty);

// Protected routes
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.get('/user/properties', protect, getUserProperties);

// Admin routes
router.put('/:id/featured', protect, authorize('admin'), toggleFeatured);
router.put('/:id/verify', protect, authorize('admin'), toggleVerified);

module.exports = router;
