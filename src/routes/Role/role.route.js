const express = require('express');
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require('../../controllers/role.controller.js');
const {
  validateRoleCreate,
  validateRoleUpdate,
  validateRoleIdParam,
} = require('../../validation/role.validation.js');

const router = express.Router();

// Create a new role
router.post('/create', validateRoleCreate, createRole);

// Update role
router.put('/update', validateRoleUpdate, updateRole);

// Delete role (soft delete)
router.delete('/delete/:id', validateRoleIdParam, deleteRole);

// Get all roles
router.get('/getall', getAllRoles);

// Get role by Role_id
router.get('/getbyid/:id', validateRoleIdParam, getRoleById);

module.exports = router;
