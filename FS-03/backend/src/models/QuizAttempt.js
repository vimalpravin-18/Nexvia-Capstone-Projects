const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedOptionIndex: { type: Number },
        isCorrect: { type: Boolean }
      }
    ],
    score: {
      type: Number,
      required: true
    },
    totalPossibleScore: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    passed: {
      type: Boolean,
      required: true
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', quizAttemptSchema);
