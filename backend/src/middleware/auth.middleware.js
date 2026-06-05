const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
  // Check session-based auth first (used when backend serves frontend on same origin)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Check JWT token in Authorization header (used for split deployments)
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(decoded.userId).select('-__v');
      if (user) {
        req.user = user;
        return next();
      }
    } catch {
      // token invalid or expired
    }
  }

  return res.status(401).json({ message: 'Authentication required' });
};

module.exports = auth;
