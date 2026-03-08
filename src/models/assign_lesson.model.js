const mongoose = require('mongoose');

const LESSONS_STATUS = ['Pending', 'Success', 'Process', 'Failed'];

const assignLessonSchema = new mongoose.Schema({
  assign_lessons_id: {
    type: Number,
    unique: true
  },
  student_id: {
    type: Number,
    ref: 'User',
    required: [true, 'Student is required']
  },
  lessons_id: {
    type: Number,
    ref: 'Lesson',
    required: [true, 'Lesson is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  topic: {
    type: String,
    trim: true,
    maxlength: [500, 'Topic cannot be more than 500 characters']
  },
  summary: {
    type: String,
    trim: true,
    maxlength: [2000, 'Summary cannot be more than 2000 characters']
  },
  lessons_status: {
    type: String,
    enum: { values: LESSONS_STATUS, message: `lessons_status must be one of: ${LESSONS_STATUS.join(', ')}` },
    default: 'Pending'
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

assignLessonSchema.pre('save', async function () {
  if (!this.isNew || this.assign_lessons_id != null) return;
  const maxDoc = await this.constructor.findOne().sort({ assign_lessons_id: -1 }).select('assign_lessons_id').lean();
  this.assign_lessons_id = (maxDoc?.assign_lessons_id ?? 0) + 1;
});

const AssignLesson = mongoose.model('AssignLesson', assignLessonSchema);
AssignLesson.LESSONS_STATUS = LESSONS_STATUS;

module.exports = AssignLesson;
