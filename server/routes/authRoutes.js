const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getUserProfile, 
  updateUserProfile, 
  logout 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
