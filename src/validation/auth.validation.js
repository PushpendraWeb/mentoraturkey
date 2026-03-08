const { SIGNUP_ALLOWED_ROLES } = require('../constants/roles.js');

function validateSignup(req, res, next) {
  const { name, role_id, mobile_no, password } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Valid name is required' });
  }
  const rid = Number(role_id);
  if (!Number.isInteger(rid) || !SIGNUP_ALLOWED_ROLES.includes(rid)) {
    return res.status(400).json({
      success: false,
      message: 'role_id must be 1 (Parent) or 3 (Mentor). Students are created by parents.',
    });
  }
  if (!mobile_no || typeof mobile_no !== 'string' || !mobile_no.trim()) {
    return res.status(400).json({ success: false, message: 'Valid mobile_no is required' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }
  next();
}

function validateCreateStudent(req, res, next) {
  const { name, mobile_no, password } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Valid name is required' });
  }
  if (!mobile_no || typeof mobile_no !== 'string' || !mobile_no.trim()) {
    return res.status(400).json({ success: false, message: 'Valid mobile_no is required' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Password is required for student' });
  }
  next();
}

function validateLogin(req, res, next) {
  const { mobile_no, password } = req.body || {};
  if (!mobile_no || typeof mobile_no !== 'string' || !mobile_no.trim()) {
    return res.status(400).json({ success: false, message: 'mobile_no is required' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }
  next();
}

function validateUpdate(req, res, next) {
  const { id } = req.body || {};
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, message: 'Valid user_id (id) is required in body' });
  }
  next();
}

function validateUserIdParam(req, res, next) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, message: 'Valid user_id (id) is required in URL' });
  }
  next();
}

module.exports = {
  validateSignup,
  validateCreateStudent,
  validateLogin,
  validateUpdate,
  validateUserIdParam,
};
