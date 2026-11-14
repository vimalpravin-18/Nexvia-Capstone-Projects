const jwt = require('jsonwebtoken');
const store = require('../config/store');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_nexvia_2026';

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = store.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User belonging to token not found' });
    }
    req.user = user;
    next();
  } catch (error) {
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

