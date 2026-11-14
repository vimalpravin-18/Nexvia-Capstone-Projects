const express = require('express');
const router = express.Router();
const {
  getPaymentConfig,
  createPaymentOrder,
  verifyPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.get('/config', getPaymentConfig);
router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;

