const express = require('express');
const {
  create,
  update,
  deleteLesson,
  getById,
  getAll,
  getByMentorId,
} = require('../../controllers/lesson.controller.js');
const {
  create: createAssign,
  update: updateAssign,
  deleteAssignLesson,
  getById: getAssignById,
  getAll: getAllAssign,
  getSessionsByLessonId,
} = require('../../controllers/assign_lesson.controller.js');
const {
  validateLessonCreate,
  validateLessonUpdate,
  validateLessonIdParam,
  validateMentorIdParam,
} = require('../../validation/lesson.validation.js');
const {
  validateAssignLessonCreate,
  validateAssignLessonUpdate,
  validateAssignLessonIdParam,
  validateLessonIdForSessions,
} = require('../../validation/assign_lesson.validation.js');
const { auth } = require('../../middleware/auth.middleware.js');

const router = express.Router();

// Public
router.get('/getall', getAll);
router.get('/getbyid/:id', validateLessonIdParam, getById);

// Protected (Authorization: Bearer <token>)
router.post('/create', auth, validateLessonCreate, create);
router.put('/update', auth, validateLessonUpdate, update);
router.delete('/delete/:id', auth, validateLessonIdParam, deleteLesson);
router.get('/getbymentorId/:mentorId', auth, validateMentorIdParam, getByMentorId);

// Sessions: GET /lessons/:id/sessions (assign_lessons for lesson id) - with auth
router.get('/:id/sessions', auth, validateLessonIdForSessions, getSessionsByLessonId);

// Assign lessons (assign_lessons model)
router.post('/assign/create', auth, validateAssignLessonCreate, createAssign);
router.put('/assign/update', auth, validateAssignLessonUpdate, updateAssign);
router.delete('/assign/delete/:id', auth, validateAssignLessonIdParam, deleteAssignLesson);
router.get('/assign/getbyid/:id', auth, validateAssignLessonIdParam, getAssignById);
router.get('/assign/getall', getAllAssign);

module.exports = router;
