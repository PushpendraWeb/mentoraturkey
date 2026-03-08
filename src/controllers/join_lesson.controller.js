const JoinLesson = require('../models/join_lesson.model.js');
const AssignLesson = require('../models/assign_lesson.model.js');

function formatJoinLesson(doc) {
  const d = doc.toObject ? doc.toObject() : doc;
  return {
    id: d._id,
    Join_lessons_id: d.Join_lessons_id,
    assign_lessons_id: d.assign_lessons_id,
    student_id: d.student_id,
    mentor_id: d.mentor_id ?? '',
    date: d.date,
    join_status: d.join_status,
    status: d.status,
    createdBy: d.createdBy ?? null,
    updatedBy: d.updatedBy ?? null,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
    DeletedBy: d.DeletedBy ?? null,
    DeletedAt: d.DeletedAt ?? null,
  };
}

/** Auto-update assign_lesson.lessons_status: Join -> Process, failed -> Failed, Pending -> Pending */
async function updateAssignLessonStatus(assign_lessons_id, join_status) {
  const map = { Join: 'Process', failed: 'Failed', Pending: 'Pending' };
  const newStatus = map[join_status];
  if (!newStatus) return;
  await AssignLesson.findOneAndUpdate(
    { assign_lessons_id: Number(assign_lessons_id), DeletedAt: null },
    { lessons_status: newStatus, updatedAt: new Date() }
  );
}

/** Join (create) - with auth */
async function join(req, res) {
  try {
    const { assign_lessons_id, student_id, mentor_id, date, join_status, status, createdBy } = req.body || {};
    const currentUser = req.user;

    if (assign_lessons_id == null || isNaN(Number(assign_lessons_id))) {
      return res.status(400).json({ success: false, message: 'Valid assign_lessons_id is required' });
    }
    if (student_id == null || isNaN(Number(student_id))) {
      return res.status(400).json({ success: false, message: 'Valid student_id (user_id) is required' });
    }

    const assignExists = await AssignLesson.findOne({ assign_lessons_id: Number(assign_lessons_id), DeletedAt: null });
    if (!assignExists) {
      return res.status(404).json({ success: false, message: 'Assign lesson not found' });
    }

    const joinStatus = JoinLesson.JOIN_STATUS.includes(join_status) ? join_status : 'Join';

    const newJoin = new JoinLesson({
      assign_lessons_id: Number(assign_lessons_id),
      student_id: Number(student_id),
      mentor_id: mentor_id != null ? String(mentor_id).trim() : '',
      date: date ? new Date(date) : new Date(),
      join_status: joinStatus,
      status: typeof status === 'boolean' ? status : true,
      createdBy: createdBy != null ? Number(createdBy) : currentUser.user_id,
    });

    const saved = await newJoin.save();
    await updateAssignLessonStatus(saved.assign_lessons_id, saved.join_status);

    return res.status(201).json({
      success: true,
      message: 'Join lesson created successfully',
      data: formatJoinLesson(saved),
    });
  } catch (err) {
    console.error('Join lesson error:', err);
    return res.status(500).json({ success: false, message: 'Join lesson failed', error: err.message });
  }
}

/** Delete - with auth */
async function deleteJoinLesson(req, res) {
  try {
    const { id } = req.params;
    const { DeletedBy } = req.body || {};
    const currentUser = req.user;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ success: false, message: 'Invalid Join_lessons_id' });
    }

    const doc = await JoinLesson.findOne({ Join_lessons_id: numericId, DeletedAt: null });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Join lesson not found' });
    }

    const updated = await JoinLesson.findOneAndUpdate(
      { Join_lessons_id: numericId, DeletedAt: null },
      {
        status: false,
        DeletedBy: DeletedBy != null ? Number(DeletedBy) : currentUser.user_id,
        DeletedAt: new Date(),
      },
      { returnDocument: 'after' }
    );

    await updateAssignLessonStatus(updated.assign_lessons_id, 'Pending');

    return res.status(200).json({
      success: true,
      message: 'Join lesson deleted successfully',
      data: formatJoinLesson(updated),
    });
  } catch (err) {
    console.error('Delete join lesson error:', err);
    return res.status(500).json({ success: false, message: 'Delete join lesson failed', error: err.message });
  }
}

/** Get by id - with auth */
async function getById(req, res) {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ success: false, message: 'Invalid Join_lessons_id' });
    }

    const doc = await JoinLesson.findOne({ Join_lessons_id: numericId, DeletedAt: null });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Join lesson not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Join lesson retrieved successfully',
      data: formatJoinLesson(doc),
    });
  } catch (err) {
    console.error('Get join lesson by id error:', err);
    return res.status(500).json({ success: false, message: 'Get join lesson failed', error: err.message });
  }
}

/** Get all */
async function getAll(req, res) {
  try {
    const list = await JoinLesson.find({ DeletedAt: null }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Join lessons retrieved successfully',
      data: list.map(formatJoinLesson),
    });
  } catch (err) {
    console.error('Get all join lessons error:', err);
    return res.status(500).json({ success: false, message: 'Get join lessons failed', error: err.message });
  }
}

module.exports = {
  join,
  deleteJoinLesson,
  getById,
  getAll,
};
