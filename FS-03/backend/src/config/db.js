/**
 * Database Connection Manager (MongoDB Atlas + Resilient Fallback)
 */
const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || (mongoURI.includes('127.0.0.1') && !process.env.USE_LOCAL_MONGO)) {
    console.log('[DB] Using local resilient JSON persistent data store for LMS.');
    return false;
  }

  try {
    // Ensure the connection uses the isolated 'nexvia_lms' database name
    let targetURI = mongoURI;
    if (targetURI.includes('mongodb.net/') && !targetURI.includes('nexvia_lms')) {
      targetURI = targetURI.replace(/mongodb\.net\/([^?]*)/, 'mongodb.net/nexvia_lms');
    }

    const conn = await mongoose.connect(targetURI, {
      serverSelectionTimeoutMS: 5000
    });

    isMongoConnected = true;
    console.log(`[DB] MongoDB Atlas Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.warn(`[DB] MongoDB Atlas connection error (${error.message}). Continuing with local resilient persistent store.`);
    isMongoConnected = false;
    return false;
  }
};

const getDBStatus = () => isMongoConnected;

module.exports = {
  connectDB,
  getDBStatus
};
