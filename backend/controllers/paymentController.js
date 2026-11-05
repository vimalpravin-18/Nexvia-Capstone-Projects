const store = require('../config/store');

const getPaymentConfig = async (req, res) => {
  res.json({
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_nexvia_marketplace',
    currency: 'INR',
    supportedGateways: ['Razorpay', 'Stripe Connect']
  });
};

const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', vendorSplit } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount required' });
    }

    const orderId = 'pay_order_' + Math.floor(100000 + Math.random() * 900000);
    const platformFee = Math.round(amount * 0.10);
    const vendorPayout = amount - platformFee;

    res.json({
      orderId,
      amount: Math.round(amount * 100),
      currency,
      status: 'created',
      platformCommission: platformFee,
      vendorPayout,
      testMode: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    res.json({
      success: true,
      transactionId: paymentId || 'txn_' + Date.now(),
      status: 'captured',
      message: 'Payment verified successfully via test gateway'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPaymentConfig,
  createPaymentOrder,
  verifyPayment
};
