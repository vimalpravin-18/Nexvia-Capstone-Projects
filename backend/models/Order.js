const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  vendorId: {
    type: String,
    required: true
  },
  vendorName: {
    type: String,
    default: 'Vendor'
  },
  image: {
    type: String
  }
}, { _id: false });

const vendorPayoutSchema = new mongoose.Schema({
  vendorId: {
    type: String,
    required: true
  },
  vendorName: {
    type: String,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  commissionFee: {
    type: Number,
    required: true
  },
  payoutAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['allocated', 'pending_payout', 'settled'],
    default: 'allocated'
  }
}, { _id: false });

const timelineStageSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['placed', 'packed', 'shipped', 'delivered', 'cancelled'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['Razorpay', 'Stripe', 'Stripe Connect', 'COD'],
    default: 'Razorpay'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'paid'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  couponCode: {
    type: String,
    default: null
  },
  finalAmount: {
    type: Number,
    required: true
  },
  platformCommissionTotal: {
    type: Number,
    required: true
  },
  vendorPayouts: [vendorPayoutSchema],
  orderStatus: {
    type: String,
    enum: ['placed', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  timeline: [timelineStageSchema]
}, {
  timestamps: true
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
