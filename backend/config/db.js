const mongoose = require('mongoose');
const { initialUsers, initialProducts, initialCoupons } = require('../data/seedData');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || mongoURI.includes('127.0.0.1') && !process.env.USE_LOCAL_MONGO) {
    // If no remote Mongo URI, skip to local persistent JSON store
    console.log('Using local persistent data store. Provide MONGO_URI in .env to connect to MongoDB Atlas.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);

    // Synchronize initial seed records if collection is brand new
    try {
      const User = require('../models/User');
      const Product = require('../models/Product');
      const Coupon = require('../models/Coupon');

      const userCount = await User.countDocuments();
      if (userCount === 0) {
        await User.insertMany(initialUsers);
        console.log('MongoDB Seeded: Initial users created in Atlas');
      }

      const prodCount = await Product.countDocuments();
      if (prodCount === 0) {
        await Product.insertMany(initialProducts);
        console.log('MongoDB Seeded: Initial products created in Atlas');
      }

      const couponCount = await Coupon.countDocuments();
      if (couponCount === 0) {
        await Coupon.insertMany(initialCoupons);
        console.log('MongoDB Seeded: Initial coupons created in Atlas');
      }
    } catch (seedErr) {
      // Collections already exist or schema indexed
    }

    return true;
  } catch (error) {
    console.log(`MongoDB connection failed (${error.message}). Continuing with local persistent store.`);
    return false;
  }
};

module.exports = connectDB;
