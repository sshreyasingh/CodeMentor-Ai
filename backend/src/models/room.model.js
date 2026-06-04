const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      maxlength: 100,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    description: {
      type: String,
      default: '',
      maxlength: 200,
    },
    code: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'javascript',
      enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'go'],
    },
  },
  { timestamps: true }
);

roomSchema.index({ owner: 1 });

module.exports = mongoose.model('Room', roomSchema);
