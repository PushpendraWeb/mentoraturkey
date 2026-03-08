const mongoose = require('mongoose');

const JOIN_STATUS = ['Join', 'failed'];

const joinLessonSchema = new mongoose.Schema({
  Join_lessons_id: {
    type: Number,
    unique: true
  },
  assign_lessons_id: {
    type: Number,
    ref: 'AssignLesson',
    required: [true, 'Assign lesson is required']
  },
  student_id: {
    type: Number,
    ref: 'User',
    required: [true, 'Student is required']
  },
  mentor_id: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  join_status: {
    type: String,
    enum: { values: JOIN_STATUS, message: `join_status must be one of: ${JOIN_STATUS.join(', ')}` },
    default: 'Join'
  },
  status: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Number,
    ref: 'User',
    default: null
  },
  updatedBy: {
    type: Number,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  DeletedBy: {
    type: Number,
    ref: 'User',
    default: null
  },
  DeletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

joinLessonSchema.pre('save', async function () {
  if (!this.isNew || this.Join_lessons_id != null) return;
  const maxDoc = await this.constructor.findOne().sort({ Join_lessons_id: -1 }).select('Join_lessons_id').lean();
  this.Join_lessons_id = (maxDoc?.Join_lessons_id ?? 0) + 1;
});

const JoinLesson = mongoose.model('JoinLesson', joinLessonSchema);
JoinLesson.JOIN_STATUS = JOIN_STATUS;

module.exports = JoinLesson;
