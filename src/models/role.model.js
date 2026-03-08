const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  Role_id: {
    type: Number,
    unique: true
  },
  Role_name: {
    type: String,
    required: [true, 'Role name is required'],
    trim: true,
    maxlength: [100, 'Role name cannot be more than 100 characters']
  },
  status: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Number,
    ref: 'User',
    default: 1
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

// Manual auto-increment for Role_id (mongoose-sequence is incompatible with Mongoose 9)
roleSchema.pre('save', async function () {
  if (!this.isNew || this.Role_id != null) return;
  const maxDoc = await this.constructor.findOne().sort({ Role_id: -1 }).select('Role_id').lean();
  this.Role_id = (maxDoc?.Role_id ?? 0) + 1;
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
