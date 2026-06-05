const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
  // JWT-first: primary auth method for split deployments (Vercel + Render)
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
    } catch (err) {
      console.error('[Auth] JWT verification failed:', err.message);
    }
  }

  // Fallback: session-based auth (same-origin deployment)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  console.log('[Auth] No valid JWT or session — rejecting');
  return res.status(401).json({ message: 'Authentication required' });
};

module.exports = auth;
