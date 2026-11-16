const mongoose = require('mongoose');
const { LIVE_CLASS_STATUS } = require('../config/constants');

const liveClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Live class title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: false
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    instructorName: {
      type: String,
      default: 'Instructor'
    },
    scheduledStartTime: {
      type: Date,
      required: [true, 'Start time is required']
    },
    scheduledEndTime: {
      type: Date,
      required: [true, 'End time is required']
    },
    durationMinutes: {
      type: Number,
      default: 60
    },
    roomCode: {
      type: String,
      unique: true,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(LIVE_CLASS_STATUS),
      default: LIVE_CLASS_STATUS.SCHEDULED
    },
    maxParticipants: {
      type: Number,
      default: 100
    },
    attendees: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        joinedAt: { type: Date, default: Date.now },
        leftAt: { type: Date }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.models.LiveClass || mongoose.model('LiveClass', liveClassSchema);
