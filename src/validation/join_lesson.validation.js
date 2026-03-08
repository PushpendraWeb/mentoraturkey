function validateJoinLessonCreate(req, res, next) {
  const { assign_lessons_id, student_id } = req.body || {};
  if (assign_lessons_id == null || isNaN(Number(assign_lessons_id))) {
    return res.status(400).json({ success: false, message: 'Valid assign_lessons_id is required' });
  }
  if (student_id == null || isNaN(Number(student_id))) {
    return res.status(400).json({ success: false, message: 'Valid student_id (user_id) is required' });
  }
  next();
}

function validateJoinLessonIdParam(req, res, next) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, message: 'Valid Join_lessons_id (id) is required in URL' });
  }
  next();
}

module.exports = {
  validateJoinLessonCreate,
  validateJoinLessonIdParam,
};
