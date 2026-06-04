const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    recurringPatterns: [
      {
        category: {
          type: String,
          enum: [
            'nested_loops',
            'variable_naming',
            'null_checks',
            'error_handling',
            'type_safety',
            'performance',
            'security',
            'documentation',
            'code_duplication',
            'complexity',
          ],
        },
        label: String,
        count: { type: Number, default: 1 },
        severity: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
        examples: [String],
        recommendation: String,
      },
    ],
    improvementScore: {
      type: Number,
      default: 0,
    },
    strengths: [String],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Insight', insightSchema);
