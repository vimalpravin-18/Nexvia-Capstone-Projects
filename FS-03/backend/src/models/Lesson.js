const mongoose = require('mongoose');
const { LESSON_TYPES } = require('../config/constants');

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(LESSON_TYPES),
      default: LESSON_TYPES.VIDEO
    },
    videoUrl: {
      type: String,
      default: ''
    },
    cloudFrontUrl: {
      type: String,
      default: ''
    },
    durationMinutes: {
      type: Number,
      default: 10
    },
    durationFormatted: {
      type: String,
      default: '10:00'
    },
    thumbnailUrl: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    transcriptNotes: [
      {
        timestamp: { type: String, default: '00:00' },
        text: { type: String, default: '' }
      }
    ],
    resources: [
      {
        title: { type: String },
        fileUrl: { type: String },
        fileType: { type: String, default: 'pdf' }
      }
    ],
    order: {
      type: Number,
      default: 1
    },
    isFreePreview: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
