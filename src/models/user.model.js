const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  role_id: {
    type: Number,
    ref: 'Role',
    required: [true, 'Role is required']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot be more than 500 characters']
  },
  mobile_no: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    trim: true,
    select: false
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

// Manual auto-increment (mongoose-sequence incompatible with Mongoose 9)
userSchema.pre('save', async function () {
  if (!this.isNew || this.user_id != null) return;
  const maxDoc = await this.constructor.findOne().sort({ user_id: -1 }).select('user_id').lean();
  this.user_id = (maxDoc?.user_id ?? 0) + 1;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
