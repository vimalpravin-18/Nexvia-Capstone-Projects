const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateVendorProfile
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/vendor/profile', protect, authorize('vendor'), updateVendorProfile);

module.exports = router;
