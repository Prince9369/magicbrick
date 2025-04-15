const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  verifyEmail, 
  forgotPassword, 
  resetPassword, 
  getCurrentUser, 
  updateProfile, 
  changePassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
