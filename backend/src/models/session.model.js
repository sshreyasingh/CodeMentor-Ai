const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
      default: '',
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['javascript', 'python', 'java', 'cpp', 'typescript', 'go', 'rust'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: Date,
  },
  { timestamps: true }
);

sessionSchema.index({ mentor: 1, status: 1 });
sessionSchema.index({ student: 1, status: 1 });

module.exports = mongoose.model('Session', sessionSchema);
