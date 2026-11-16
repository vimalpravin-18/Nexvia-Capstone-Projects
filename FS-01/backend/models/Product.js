const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    default: 'Generic',
    trim: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  vendorId: {
    type: String,
    required: true
  },
  vendorName: {
    type: String,
    default: 'Verified Vendor'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);

