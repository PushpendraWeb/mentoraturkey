function validateAssignLessonCreate(req, res, next) {
  const { student_id, lessons_id } = req.body || {};
  if (student_id == null || isNaN(Number(student_id))) {
    return res.status(400).json({ success: false, message: 'Valid student_id (user_id) is required' });
  }
  if (lessons_id == null || isNaN(Number(lessons_id))) {
    return res.status(400).json({ success: false, message: 'Valid lessons_id is required' });
  }
  next();
}

function validateAssignLessonUpdate(req, res, next) {
  const { id } = req.body || {};
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, message: 'Valid assign_lessons_id (id) is required in body' });
  }
  next();
}

function validateAssignLessonIdParam(req, res, next) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, message: 'Valid assign_lessons_id (id) is required in URL' });
  }
  next();
}

function validateLessonIdForSessions(req, res, next) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, message: 'Valid lesson id is required in URL' });
  }
  next();
}

module.exports = {
  validateAssignLessonCreate,
  validateAssignLessonUpdate,
  validateAssignLessonIdParam,
  validateLessonIdForSessions,
};
