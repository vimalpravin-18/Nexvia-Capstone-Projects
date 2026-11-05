const express = require('express');
const router = express.Router();
const {
  getCoupons,
  validateCoupon,
  createCoupon
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCoupons);
router.post('/validate', validateCoupon);
router.post('/', protect, authorize('admin'), createCoupon);

module.exports = router;
