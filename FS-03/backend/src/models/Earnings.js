const mongoose = require('mongoose');
const { EARNINGS_STATUS } = require('../config/constants');

const earningsSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    courseTitle: {
      type: String,
      required: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentName: {
      type: String,
      default: 'Student'
    },
    grossAmount: {
      type: Number,
      required: true
    },
    platformFee: {
      type: Number,
      required: true
    },
    netInstructorAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(EARNINGS_STATUS),
      default: EARNINGS_STATUS.CLEARED
    },
    payoutDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Earnings || mongoose.model('Earnings', earningsSchema);
