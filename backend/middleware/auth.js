const jwt = require('jsonwebtoken');
const store = require('../config/store');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_nexvia_2026_enterprise';

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // Graceful demo/guest fallback: attach default customer account
    const demoCustomer = store.findUserById('usr_customer');
    if (demoCustomer) {
      req.user = demoCustomer;
      return next();
    }
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = store.findUserById(decoded.id) || (decoded.email ? store.findUserByEmail(decoded.email) : null);
    if (!user) {
      const demoCustomer = store.findUserById('usr_customer');
      if (demoCustomer) {
        req.user = demoCustomer;
        return next();
      }
      return res.status(401).json({ message: 'User belonging to token not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    // If token invalid/expired, fall back to demo customer account
    const demoCustomer = store.findUserById('usr_customer');
    if (demoCustomer) {
      req.user = demoCustomer;
      return next();
    }
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: role ${req.user ? req.user.role : 'guest'} does not have access`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
