const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountPercent: {
    type: Number,
    min: 1,
    max: 100
  },
  flatDiscount: {
    type: Number,
    min: 0
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

