const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: false
    },
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    passingScorePercentage: {
      type: Number,
      default: 70
    },
    timeLimitMinutes: {
      type: Number,
      default: 15
    },
    totalQuestions: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
