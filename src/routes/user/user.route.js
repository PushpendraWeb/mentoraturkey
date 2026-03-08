const express = require('express');
const { createUser, getAllUsers } = require('../../controllers/user.controller.js');
const {
  update,
  deleteUser: deleteAuthUser,
  getById,
  getAll,
  getByAuth,
  createStudent,
} = require('../../controllers/auth.controller.js');
const { validateUserCreate } = require('../../validation/user.validation.js');
const {
  validateUpdate,
  validateUserIdParam: validateAuthUserIdParam,
  validateCreateStudent,
} = require('../../validation/auth.validation.js');
const { auth, requireParent } = require('../../middleware/auth.middleware.js');

const router = express.Router();

// Protected auth routes (JWT required: Authorization: Bearer <token>) - checked first
router.get('/getbyAuth', auth, getByAuth);
router.get('/getall', auth, getAll);
router.get('/getbyid/:id', auth, validateAuthUserIdParam, getById);
router.put('/update', auth, validateUpdate, update);
router.delete('/delete/:id', auth, validateAuthUserIdParam, deleteAuthUser);

// Only parents can create students
router.post('/create-student', auth, requireParent, validateCreateStudent, createStudent);

// User CRUD (no auth) - create and list only; getbyid/update/delete are protected above
router.post('/create', validateUserCreate, createUser);
router.get('/all', getAllUsers);

module.exports = router; 