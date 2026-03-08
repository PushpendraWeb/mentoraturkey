const Role = require('../models/role.model.js');

const formatRole = (role) => ({
  id: role._id,
  Role_id: role.Role_id,
  Role_name: role.Role_name,
  status: role.status,
  createdBy: role.createdBy,
  updatedBy: role.updatedBy ?? null,
  createdAt: role.createdAt,
  updatedAt: role.updatedAt,
  DeletedBy: role.DeletedBy ?? null,
  DeletedAt: role.DeletedAt ?? null,
});

// Create a new role
const createRole = async (req, res) => {
  try {
    const { Role_name, status, createdBy } = req.body || {};

    if (!Role_name || typeof Role_name !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Role_name is required and must be a string',
      });
    }

    const newRole = new Role({
      Role_name: Role_name.trim(),
      status: typeof status === 'boolean' ? status : true,
      createdBy: createdBy ?? 1,
    });

    const savedRole = await newRole.save();

    return res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: formatRole(savedRole),
    });
  } catch (error) {
    console.error('Error creating role:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get all roles (excluding soft-deleted)
const getAllRoles = async (_req, res) => {
  try {
    const roles = await Role.find({ DeletedAt: null }).sort({ createdAt: -1 });
    const data = roles.map(formatRole);

    return res.status(200).json({
      success: true,
      message: 'Roles retrieved successfully',
      data,
    });
  } catch (error) {
    console.error('Error getting roles:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get role by Role_id
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Role_id provided',
      });
    }

    const role = await Role.findOne({ Role_id: numericId, DeletedAt: null });
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Role retrieved successfully',
      data: formatRole(role),
    });
  } catch (error) {
    console.error('Error getting role:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update role by Role_id
const updateRole = async (req, res) => {
  try {
    const { id, Role_name, status, updatedBy } = req.body || {};

    const numericId = parseInt(id, 10);
    if (!id || isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid Role_id (id) is required',
      });
    }

    const update = {
      ...(Role_name !== undefined && { Role_name: Role_name.trim() }),
      ...(status !== undefined && { status }),
      ...(updatedBy !== undefined && { updatedBy }),
      updatedAt: new Date(),
    };

    const role = await Role.findOneAndUpdate(
      { Role_id: numericId, DeletedAt: null },
      update,
      { returnDocument: 'after' }
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: formatRole(role),
    });
  } catch (error) {
    console.error('Error updating role:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Soft delete role by Role_id
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body || {};

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Role_id provided',
      });
    }

    const update = {
      status: false,
      DeletedBy: DeletedBy ?? null,
      DeletedAt: new Date(),
    };

    const role = await Role.findOneAndUpdate(
      { Role_id: numericId, DeletedAt: null },
      update,
      { returnDocument: 'after' }
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
      data: formatRole(role),
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
