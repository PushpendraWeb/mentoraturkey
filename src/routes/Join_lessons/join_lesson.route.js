const express = require('express');
const {
  join,
  deleteJoinLesson,
  getById,
  getAll,
} = require('../../controllers/join_lesson.controller.js');
const {
  validateJoinLessonCreate,
  validateJoinLessonIdParam,
} = require('../../validation/join_lesson.validation.js');
const { auth } = require('../../middleware/auth.middleware.js');

const router = express.Router();

router.post('/join', auth, validateJoinLessonCreate, join);
router.delete('/delete/:id', auth, validateJoinLessonIdParam, deleteJoinLesson);
router.get('/getbyid/:id', auth, validateJoinLessonIdParam, getById);
router.get('/getall', getAll);

module.exports = router;
