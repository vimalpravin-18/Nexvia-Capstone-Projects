/**
 * JWT Authentication & Role-Based Authorization Middleware
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const storeAdapter = require('../config/store');
const { getDBStatus } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'nexvia_lms_super_secret_jwt_key_2026';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (getDBStatus()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found.' });
      }
      req.user = user;
    } else {
      const user = storeAdapter.findById('users', decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found in local store.' });
      }
      const { password, ...safeUser } = user;
      req.user = safeUser;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or token has expired.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource. Required: [${roles.join(', ')}]`
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
  JWT_SECRET
};
