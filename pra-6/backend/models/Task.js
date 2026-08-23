const mongoose = require('mongoose');

/**
 * Task Schema Definition
 * Defines the structure, data types, default values, and validation rules
 * for Task documents in the MongoDB 'tasks' collection.
 */
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: '{VALUE} is not a valid priority. Allowed values: low, medium, high'
    },
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-Save Middleware Hook
 * Automatically runs before saving a document to trim whitespace
 */
taskSchema.pre('save', function () {
  if (this.title && typeof this.title === 'string') {
    this.title = this.title.trim();
  }
  if (this.description && typeof this.description === 'string') {
    this.description = this.description.trim();
  }
});

// Export the compiled Mongoose model
module.exports = mongoose.model('Task', taskSchema);
