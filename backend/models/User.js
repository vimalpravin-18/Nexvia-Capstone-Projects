const mongoose = require('mongoose');

const vendorProfileSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  commissionRate: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  balance: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'suspended'],
    default: 'approved'
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer'
  },
  vendorProfile: {
    type: vendorProfileSchema,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

