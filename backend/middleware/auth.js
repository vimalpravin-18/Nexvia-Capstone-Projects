const jwt = require('jsonwebtoken');
const store = require('../config/store');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_nexvia_2026_enterprise';

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = store.findUserById(decoded.id) || (decoded.email ? store.findUserByEmail(decoded.email) : null);
    if (!user) {
      return res.status(401).json({ message: 'User belonging to this token does not exist.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token. Please sign in again.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: role ${req.user ? req.user.role : 'guest'} does not have access to this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
