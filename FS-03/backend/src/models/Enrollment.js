const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
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
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
      }
    ],
    progressPercentage: {
      type: Number,
      default: 0
    },
    lastAccessedLessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active'
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);
