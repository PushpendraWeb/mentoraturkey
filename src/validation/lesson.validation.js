function validateLessonCreate(req, res, next) {
  const { title } = req.body || {};
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }
  next();
}

function validateLessonUpdate(req, res, next) {
  const { id } = req.body || {};
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, message: 'Valid lessons_id (id) is required in body' });
  }
  next();
}

function validateLessonIdParam(req, res, next) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, message: 'Valid lessons_id (id) is required in URL' });
  }
  next();
}

function validateMentorIdParam(req, res, next) {
  const { mentorId } = req.params;
  if (!mentorId || isNaN(parseInt(mentorId, 10))) {
    return res.status(400).json({ success: false, message: 'Valid mentorId is required in URL' });
  }
  next();
}

module.exports = {
  validateLessonCreate,
  validateLessonUpdate,
  validateLessonIdParam,
  validateMentorIdParam,
};
