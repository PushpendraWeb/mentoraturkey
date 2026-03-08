const AssignLesson = require('../models/assign_lesson.model.js');

function formatAssignLesson(doc) {
  const d = doc.toObject ? doc.toObject() : doc;
  return {
    id: d._id,
    assign_lessons_id: d.assign_lessons_id,
    student_id: d.student_id,
    lessons_id: d.lessons_id,
    date: d.date,
    topic: d.topic ?? '',
    summary: d.summary ?? '',
    lessons_status: d.lessons_status,
    status: d.status,
    createdBy: d.createdBy ?? null,
    updatedBy: d.updatedBy ?? null,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
    DeletedBy: d.DeletedBy ?? null,
    DeletedAt: d.DeletedAt ?? null,
  };
}

async function create(req, res) {
  try {
    const { student_id, lessons_id, date, topic, summary, lessons_status, status, createdBy } = req.body || {};
    const currentUser = req.user;

    if (student_id == null || isNaN(Number(student_id))) {
      return res.status(400).json({ success: false, message: 'Valid student_id (user_id) is required' });
    }
    if (lessons_id == null || isNaN(Number(lessons_id))) {
      return res.status(400).json({ success: false, message: 'Valid lessons_id is required' });
    }

    const newAssign = new AssignLesson({
      student_id: Number(student_id),
      lessons_id: Number(lessons_id),
      date: date ? new Date(date) : new Date(),
      topic: (topic || '').trim(),
      summary: (summary || '').trim(),
      lessons_status: AssignLesson.LESSONS_STATUS.includes(lessons_status) ? lessons_status : 'Pending',
      status: typeof status === 'boolean' ? status : true,
      createdBy: createdBy != null ? Number(createdBy) : currentUser.user_id,
    });

    const saved = await newAssign.save();
    return res.status(201).json({
      success: true,
      message: 'Assign lesson created successfully',
      data: formatAssignLesson(saved),
    });
  } catch (err) {
    console.error('Create assign lesson error:', err);
    return res.status(500).json({ success: false, message: 'Create assign lesson failed', error: err.message });
  }
}

async function update(req, res) {
  try {
    const { id, student_id, lessons_id, date, topic, summary, lessons_status, status, updatedBy } = req.body || {};
    const numericId = parseInt(id, 10);

    if (!id || isNaN(numericId)) {
      return res.status(400).json({ success: false, message: 'Valid assign_lessons_id (id) is required' });
    }

    const updateFields = {
      updatedAt: new Date(),
    };
    if (student_id !== undefined) updateFields.student_id = Number(student_id);
    if (lessons_id !== undefined) updateFields.lessons_id = Number(lessons_id);
    if (date !== undefined) updateFields.date = new Date(date);
    if (topic !== undefined) updateFields.topic = topic.trim();
    if (summary !== undefined) updateFields.summary = summary.trim();
    if (lessons_status !== undefined && AssignLesson.LESSONS_STATUS.includes(lessons_status)) {
      updateFields.lessons_status = lessons_status;
    }
    if (status !== undefined) updateFields.status = status;
    if (updatedBy !== undefined) updateFields.updatedBy = Number(updatedBy);

    const doc = await AssignLesson.findOneAndUpdate(
      { assign_lessons_id: numericId, DeletedAt: null },
      updateFields,
      { returnDocument: 'after' }
    );

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Assign lesson not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Assign lesson updated successfully',
      data: formatAssignLesson(doc),
    });
  } catch (err) {
    console.error('Update assign lesson error:', err);
    return res.status(500).json({ success: false, message: 'Update assign lesson failed', error: err.message });
  }
}

async function deleteAssignLesson(req, res) {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body || {};
    const currentUser = req.user;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ success: false, message: 'Invalid assign_lessons_id' });
    }

    const doc = await AssignLesson.findOneAndUpdate(
      { assign_lessons_id: numericId, DeletedAt: null },
      {
        status: false,
        DeletedBy: DeletedBy != null ? Number(DeletedBy) : currentUser.user_id,
        DeletedAt: new Date(),
      },
      { returnDocument: 'after' }
    );

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Assign lesson not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Assign lesson deleted successfully',
      data: formatAssignLesson(doc),
    });
  } catch (err) {
    console.error('Delete assign lesson error:', err);
    return res.status(500).json({ success: false, message: 'Delete assign lesson failed', error: err.message });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ success: false, message: 'Invalid assign_lessons_id' });
    }

    const doc = await AssignLesson.findOne({ assign_lessons_id: numericId, DeletedAt: null });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Assign lesson not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Assign lesson retrieved successfully',
      data: formatAssignLesson(doc),
    });
  } catch (err) {
    console.error('Get assign lesson by id error:', err);
    return res.status(500).json({ success: false, message: 'Get assign lesson failed', error: err.message });
  }
}

async function getAll(req, res) {
  try {
    const list = await AssignLesson.find({ DeletedAt: null }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Assign lessons retrieved successfully',
      data: list.map(formatAssignLesson),
    });
  } catch (err) {
    console.error('Get all assign lessons error:', err);
    return res.status(500).json({ success: false, message: 'Get assign lessons failed', error: err.message });
  }
}

async function getSessionsByLessonId(req, res) {
  try {
    const { id } = req.params;
    const lessonNumericId = parseInt(id, 10);

    if (isNaN(lessonNumericId)) {
      return res.status(400).json({ success: false, message: 'Invalid lesson id' });
    }

    const sessions = await AssignLesson.find({ lessons_id: lessonNumericId, DeletedAt: null }).sort({ date: -1 });
    return res.status(200).json({
      success: true,
      message: 'Sessions for lesson retrieved successfully',
      data: sessions.map(formatAssignLesson),
    });
  } catch (err) {
    console.error('Get sessions by lesson id error:', err);
    return res.status(500).json({ success: false, message: 'Get sessions failed', error: err.message });
  }
}

module.exports = {
  create,
  update,
  deleteAssignLesson,
  getById,
  getAll,
  getSessionsByLessonId,
};
