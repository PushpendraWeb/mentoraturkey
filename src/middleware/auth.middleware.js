const jwt = require('jsonwebtoken');
const env = require('../config/env.js');
const User = require('../models/user.model.js');
const { ROLE_ID } = require('../constants/roles.js');

/**
 * Verify JWT and attach req.user (user document). Use for protected routes.
 */
async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token required' });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findOne({
      user_id: decoded.user_id,
      DeletedAt: null,
      status: true,
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    return res.status(500).json({ success: false, message: 'Authentication failed', error: err.message });
  }
}

/**
 * Restrict to Parent role only (e.g. for creating students).
 */
function requireParent(req, res, next) {
  if (req.user.role_id !== ROLE_ID.PARENT) {
    return res.status(403).json({ success: false, message: 'Only parents can perform this action' });
  }
  next();
}

/**
 * Restrict to Mentor role only (e.g. for creating lessons).
 */
function requireMentor(req, res, next) {
  if (req.user.role_id !== ROLE_ID.MENTOR) {
    return res.status(403).json({ success: false, message: 'Only mentors can perform this action' });
  }
  next();
}

module.exports = { auth, requireParent, requireMentor };
