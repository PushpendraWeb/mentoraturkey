const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  lessons_id: {
    type: Number,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  mentorId: {
    type: Number,
    ref: 'User',
    required: [true, 'Mentor is required']
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

// Manual auto-increment for lessons_id
lessonSchema.pre('save', async function () {
  if (!this.isNew || this.lessons_id != null) return;
  const maxDoc = await this.constructor.findOne().sort({ lessons_id: -1 }).select('lessons_id').lean();
  this.lessons_id = (maxDoc?.lessons_id ?? 0) + 1;
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
