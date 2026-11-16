const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required']
    },
    options: [
      {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false }
      }
    ],
    explanation: {
      type: String,
      default: ''
    },
    points: {
      type: Number,
      default: 10
    },
    order: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Question || mongoose.model('Question', questionSchema);
