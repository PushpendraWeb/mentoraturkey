function validateUserCreate(req, res, next) {
  const { name, mobile_no, role_id } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ success: false, message: 'Valid name is required' });
  }
  if (!mobile_no || typeof mobile_no !== 'string') {
    return res.status(400).json({ success: false, message: 'Valid mobile_no is required' });
  }
  if (role_id != null && isNaN(Number(role_id))) {
    return res.status(400).json({ success: false, message: 'role_id must be a number (1=Parent, 2=Student, 3=Mentor)' });
  }
  next();
}

function validateUserUpdate(req, res, next) {
  const { id } = req.body || {};
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, message: 'Valid numeric user_id (id) is required' });
  }
  next();
}

function validateUserIdParam(req, res, next) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, message: 'Valid numeric user_id param is required' });
  }
  next();
}

module.exports = {
  validateUserCreate,
  validateUserUpdate,
  validateUserIdParam,
};

