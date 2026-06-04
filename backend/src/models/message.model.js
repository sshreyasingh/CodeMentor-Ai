const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    session: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: 5000,
    },
    type: {
      type: String,
      enum: ['text', 'code', 'system'],
      default: 'text',
    },
    language: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

messageSchema.index({ session: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
