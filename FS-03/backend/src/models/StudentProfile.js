const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    enrolledCoursesCount: {
      type: Number,
      default: 0
    },
    completedCoursesCount: {
      type: Number,
      default: 0
    },
    certificatesEarned: {
      type: Number,
      default: 0
    },
    weeklyGoalPercentage: {
      type: Number,
      default: 85
    },
    interests: [{ type: String }],
    streakDays: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);
