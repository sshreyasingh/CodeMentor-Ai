const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: {
      type: String,
      required: true,
      maxlength: 20000,
    },
    language: {
      type: String,
      required: true,
    },
    bugs: [
      {
        severity: { type: String, enum: ['high', 'medium', 'low'] },
        line: Number,
        description: String,
        suggestion: String,
      },
    ],
    security: [
      {
        severity: { type: String, enum: ['high', 'medium', 'low'] },
        line: Number,
        issue: String,
        remediation: String,
      },
    ],
    optimizations: [
      {
        title: String,
        description: String,
        before: String,
        after: String,
      },
    ],
    complexity: {
      bigONotation: String,
      cyclomaticComplexity: Number,
      readability: Number,
      suggestions: [String],
    },
    documentation: [
      {
        target: String,
        issue: String,
        suggestion: String,
      },
    ],
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
