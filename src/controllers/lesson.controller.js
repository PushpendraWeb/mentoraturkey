const Lesson = require('../models/lesson.model.js');

function formatLesson(lesson) {
  const doc = lesson.toObject ? lesson.toObject() : lesson;
  return {
    id: doc._id,
    lessons_id: doc.lessons_id,
    title: doc.title,
    description: doc.description ?? '',
    mentorId: doc.mentorId,
    status: doc.status,
    createdBy: doc.createdBy ?? null,
    updatedBy: doc.updatedBy ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    DeletedBy: doc.DeletedBy ?? null,
    DeletedAt: doc.DeletedAt ?? null,
  };
}

async function create(req, res) {
  try {
    const { title, description, status } = req.body || {};
    const currentUser = req.user;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    // mentorId and createdBy are set from the authenticated mentor only
    const newLesson = new Lesson({
      title: title.trim(),
      description: (description || '').trim(),
      mentorId: currentUser.user_id,
      status: typeof status === 'boolean' ? status : true,
      createdBy: currentUser.user_id,
    });

    const saved = await newLesson.save();
    return res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: formatLesson(saved),
    });
  } catch (err) {
    console.error('Create lesson error:', err);
    return res.status(500).json({ success: false, message: 'Create lesson failed', error: err.message });
  }
}

async function update(req, res) {
  try {
    const { id, title, description, mentorId, status, updatedBy } = req.body || {};
    const numericId = parseInt(id, 10);

    if (!id || isNaN(numericId)) {
      return res.status(400).json({ success: false, message: 'Valid lessons_id (id) is required' });
    }

    const updateFields = {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(mentorId !== undefined && { mentorId: Number(mentorId) }),
      ...(status !== undefined && { status }),
      ...(updatedBy !== undefined && { updatedBy: Number(updatedBy) }),
      updatedAt: new Date(),
    };

    const lesson = await Lesson.findOneAndUpdate(
      { lessons_id: numericId, DeletedAt: null },
      updateFields,
      { returnDocument: 'after' }
    );

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: formatLesson(lesson),
    });
  } catch (err) {
    console.error('Update lesson error:', err);
    return res.status(500).json({ success: false, message: 'Update lesson failed', error: err.message });
  }
}

async function deleteLesson(req, res) {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body || {};
    const currentUser = req.user;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ success: false, message: 'Invalid lessons_id' });
    }

    const lesson = await Lesson.findOneAndUpdate(
      { lessons_id: numericId, DeletedAt: null },
      {
        status: false,
        DeletedBy: DeletedBy != null ? Number(DeletedBy) : currentUser.user_id,
        DeletedAt: new Date(),
      },
      { returnDocument: 'after' }
    );

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
      data: formatLesson(lesson),
    });
  } catch (err) {
    console.error('Delete lesson error:', err);
    return res.status(500).json({ success: false, message: 'Delete lesson failed', error: err.message });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ success: false, message: 'Invalid lessons_id' });
    }

    const lesson = await Lesson.findOne({ lessons_id: numericId, DeletedAt: null });
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Lesson retrieved successfully',
      data: formatLesson(lesson),
    });
  } catch (err) {
    console.error('Get lesson by id error:', err);
    return res.status(500).json({ success: false, message: 'Get lesson failed', error: err.message });
  }
}

async function getAll(req, res) {
  try {
    const lessons = await Lesson.find({ DeletedAt: null }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Lessons retrieved successfully',
      data: lessons.map(formatLesson),
    });
  } catch (err) {
    console.error('Get all lessons error:', err);
    return res.status(500).json({ success: false, message: 'Get lessons failed', error: err.message });
  }
}

async function getByMentorId(req, res) {
  try {
    const { mentorId } = req.params;
    const numericMentorId = parseInt(mentorId, 10);

    if (isNaN(numericMentorId)) {
      return res.status(400).json({ success: false, message: 'Invalid mentorId' });
    }

    const lessons = await Lesson.find({ mentorId: numericMentorId, DeletedAt: null }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Lessons by mentor retrieved successfully',
      data: lessons.map(formatLesson),
    });
  } catch (err) {
    console.error('Get lessons by mentor error:', err);
    return res.status(500).json({ success: false, message: 'Get lessons by mentor failed', error: err.message });
  }
}

module.exports = {
  create,
  update,
  deleteLesson,
  getById,
  getAll,
  getByMentorId,
};
