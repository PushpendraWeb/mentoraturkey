const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const env = require('../config/env.js');
const { ROLE_ID } = require('../constants/roles.js');

function formatUser(user) {
  const u = user.toObject ? user.toObject() : user;
  delete u.password;
  return {
    id: u._id,
    user_id: u.user_id,
    name: u.name,
    role_id: u.role_id,
    address: u.address,
    mobile_no: u.mobile_no,
    status: u.status,
    createdBy: u.createdBy ?? null,
    updatedBy: u.updatedBy ?? null,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    DeletedBy: u.DeletedBy ?? null,
    DeletedAt: u.DeletedAt ?? null,
  };
}

/** Signup: only Parent and Mentor */
async function signup(req, res) {
  try {
    const { name, address, mobile_no, password, createdBy } = req.body || {};
    const role_id = req.signupRoleId; // set by validateSignup (only Parent or Mentor)

    const existing = await User.findOne({ mobile_no: (mobile_no || '').trim(), DeletedAt: null });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Mobile number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password || '', 10);
    const newUser = new User({
      name: (name || '').trim(),
      role_id,
      address: (address || '').trim(),
      mobile_no: (mobile_no || '').trim(),
      password: hashedPassword,
      status: true,
      createdBy: createdBy ? Number(createdBy) : null,
    });

    const saved = await newUser.save();
    const token = jwt.sign(
      { user_id: saved.user_id },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      data: { user: formatUser(saved), token },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, message: 'Signup failed', error: err.message });
  }
}

/** Create student: only parent can create (role_id = 2). Protected. */
async function createStudent(req, res) {
  try {
    const { name, address, mobile_no, password } = req.body || {};
    const parentUser = req.user;

    const existing = await User.findOne({ mobile_no: (mobile_no || '').trim(), DeletedAt: null });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Mobile number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password || '', 10);
    const newUser = new User({
      name: (name || '').trim(),
      role_id: ROLE_ID.STUDENT,
      address: (address || '').trim(),
      mobile_no: (mobile_no || '').trim(),
      password: hashedPassword,
      status: true,
      createdBy: parentUser.user_id,
    });

    const saved = await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: formatUser(saved),
    });
  } catch (err) {
    console.error('Create student error:', err);
    return res.status(500).json({ success: false, message: 'Create student failed', error: err.message });
  }
}

/** Login: mobile_no + password, returns token */
async function login(req, res) {
  try {
    const { mobile_no, password } = req.body || {};

    const user = await User.findOne({
      mobile_no: (mobile_no || '').trim(),
      DeletedAt: null,
      status: true,
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid mobile number or password' });
    }

    const match = await bcrypt.compare(password || '', user.password || '');
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid mobile number or password' });
    }

    const token = jwt.sign(
      { user_id: user.user_id },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: formatUser(user), token },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
}

/** Update user by user_id (body id). Protected. */
async function update(req, res) {
  try {
    const { id, name, role_id, address, mobile_no, status, updatedBy } = req.body || {};
    const numericId = parseInt(id, 10);
    if (!id || isNaN(numericId)) {
      return res.status(400).json({ success: false, message: 'Valid user_id (id) is required' });
    }

    const update = {
      ...(name !== undefined && { name: name.trim() }),
      ...(role_id !== undefined && { role_id: Number(role_id) }),
      ...(address !== undefined && { address: address.trim() }),
      ...(mobile_no !== undefined && { mobile_no: mobile_no.trim() }),
      ...(status !== undefined && { status }),
      ...(updatedBy !== undefined && { updatedBy: Number(updatedBy) }),
      updatedAt: new Date(),
    };

    const user = await User.findOneAndUpdate(
      { user_id: numericId, DeletedAt: null },
      update,
      { returnDocument: 'after' }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: formatUser(user),
    });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
}

/** Soft delete by user_id. Protected. */
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body || {};
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ success: false, message: 'Invalid user_id' });
    }

    const user = await User.findOneAndUpdate(
      { user_id: numericId, DeletedAt: null },
      {
        status: false,
        DeletedBy: DeletedBy ? Number(DeletedBy) : req.user?.user_id ?? null,
        DeletedAt: new Date(),
      },
      { returnDocument: 'after' }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: formatUser(user),
    });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
  }
}

/** Get user by user_id. Protected. */
async function getById(req, res) {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ success: false, message: 'Invalid user_id' });
    }

    const user = await User.findOne({ user_id: numericId, DeletedAt: null });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: formatUser(user),
    });
  } catch (err) {
    console.error('GetById error:', err);
    return res.status(500).json({ success: false, message: 'Get user failed', error: err.message });
  }
}

/** Get all users (non-deleted). Protected. */
async function getAll(req, res) {
  try {
    const users = await User.find({ DeletedAt: null }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users.map((u) => formatUser(u)),
    });
  } catch (err) {
    console.error('GetAll error:', err);
    return res.status(500).json({ success: false, message: 'Get users failed', error: err.message });
  }
}

/** Get current authenticated user. Protected. */
async function getByAuth(req, res) {
  try {
    return res.status(200).json({
      success: true,
      message: 'Current user retrieved successfully',
      data: formatUser(req.user),
    });
  } catch (err) {
    console.error('GetByAuth error:', err);
    return res.status(500).json({ success: false, message: 'Get current user failed', error: err.message });
  }
}

module.exports = {
  signup,
  createStudent,
  login,
  update,
  deleteUser,
  getById,
  getAll,
  getByAuth,
};
