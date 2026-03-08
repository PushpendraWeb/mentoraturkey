const {
  SIGNUP_ALLOWED_ROLES,
  SIGNUP_ALLOWED_ROLE_NAMES,
  ROLE_NAME_TO_ID,
} = require('../constants/roles.js');

function validateSignup(req, res, next) {
  const { name, role, role_id, mobile_no, password } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Valid name is required' });
  }
  // Accept only role "Parent" or "Mentor" (by name or by id)
  let resolvedRoleId = null;
  if (role != null && typeof role === 'string') {
    const normalized = role.trim();
    const key = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
    if (ROLE_NAME_TO_ID[key] != null) {
      resolvedRoleId = ROLE_NAME_TO_ID[key];
    }
  }
  if (resolvedRoleId == null) {
    const rid = Number(role_id);
    if (Number.isInteger(rid) && SIGNUP_ALLOWED_ROLES.includes(rid)) {
      resolvedRoleId = rid;
    }
  }
  if (resolvedRoleId == null) {
    return res.status(400).json({
      success: false,
      message: `Role must be one of: ${SIGNUP_ALLOWED_ROLE_NAMES.join(', ')}. Students are created by parents.`,
    });
  }
  req.signupRoleId = resolvedRoleId;
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
