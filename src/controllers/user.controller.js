const User = require('../models/user.model.js');

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, role_id, address, mobile_no, status, createdBy } = req.body || {};

    if (!name || !mobile_no) {
      return res.status(400).json({
        success: false,
        message: 'Name and mobile_no are required',
      });
    }

    const newUser = new User({
      name,
      role_id: role_id != null ? Number(role_id) : 1,
      address,
      mobile_no,
      status: typeof status === 'boolean' ? status : true,
      createdBy: createdBy != null ? Number(createdBy) : null,
      updatedBy: createdBy != null ? Number(createdBy) : null,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: savedUser._id,
        user_id: savedUser.user_id,
        name: savedUser.name,
        role_id: savedUser.role_id,
        address: savedUser.address,
        mobile_no: savedUser.mobile_no,
        status: savedUser.status,
        createdBy: savedUser.createdBy,
        updatedBy: savedUser.updatedBy,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
        DeletedBy: savedUser.DeletedBy || null,
        DeletedAt: savedUser.DeletedAt || null,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get all users (excluding soft-deleted)
const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find({ DeletedAt: { $exists: false } }).sort({ createdAt: -1 });
    const data = users.map((user) => ({
      id: user._id,
      user_id: user.user_id,
      name: user.name,
      address: user.address,
      phone: user.phone,
      status: user.status,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      DeletedBy: user.DeletedBy || null,
      DeletedAt: user.DeletedAt || null,
    }));

    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data,
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get user by user_id (numeric ID)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user_id provided',
      });
    }
    const user = await User.findOne({ user_id: numericId, DeletedAt: null });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        id: user._id,
        user_id: user.user_id,
        name: user.name,
        role_id: user.role_id,
        address: user.address,
        mobile_no: user.mobile_no,
        status: user.status,
        createdBy: user.createdBy,
        updatedBy: user.updatedBy,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        DeletedBy: user.DeletedBy || null,
        DeletedAt: user.DeletedAt || null,
      },
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update user by user_id
const updateUser = async (req, res) => {
  try {
    const { id, name, role_id, address, mobile_no, status, updatedBy } = req.body || {};

    const numericId = parseInt(id, 10);
    if (!id || isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user_id is required',
      });
    }

    const update = {
      ...(name !== undefined && { name }),
      ...(role_id !== undefined && { role_id: Number(role_id) }),
      ...(address !== undefined && { address }),
      ...(mobile_no !== undefined && { mobile_no }),
      ...(status !== undefined && { status }),
      ...(updatedBy !== undefined && { updatedBy }),
      updatedAt: new Date(),
    };

    const user = await User.findOneAndUpdate({ user_id: numericId, DeletedAt: null }, update, {
      returnDocument: 'after',
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user._id,
        user_id: user.user_id,
        name: user.name,
        role_id: user.role_id,
        address: user.address,
        mobile_no: user.mobile_no,
        status: user.status,
        createdBy: user.createdBy,
        updatedBy: user.updatedBy,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        DeletedBy: user.DeletedBy || null,
        DeletedAt: user.DeletedAt || null,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Soft delete user by user_id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body;

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user_id provided',
      });
    }

    const update = {
      status: false,
      DeletedBy: DeletedBy || null,
      DeletedAt: new Date(),
    };

    const user = await User.findOneAndUpdate({ user_id: numericId }, update, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {
        id: user._id,
        user_id: user.user_id,
        name: user.name,
        role_id: user.role_id,
        address: user.address,
        mobile_no: user.mobile_no,
        status: user.status,
        createdBy: user.createdBy,
        updatedBy: user.updatedBy,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        DeletedBy: user.DeletedBy || null,
        DeletedAt: user.DeletedAt || null,
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

