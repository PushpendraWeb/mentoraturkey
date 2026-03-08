function validateRoleCreate(req, res, next) {
  const { Role_name } = req.body || {};
  if (!Role_name || typeof Role_name !== 'string') {
    return res.status(400).json({ success: false, message: 'Valid Role_name is required' });
  }
  next();
}

function validateRoleUpdate(req, res, next) {
  const { id } = req.body || {};
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, message: 'Valid numeric Role_id (id) is required' });
  }
  next();
}

function validateRoleIdParam(req, res, next) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, message: 'Valid numeric Role_id param is required' });
  }
  next();
}

module.exports = {
  validateRoleCreate,
  validateRoleUpdate,
  validateRoleIdParam,
};
