const mongoose = require('mongoose');
const { COURSE_STATUS, COURSE_LEVELS } = require('../config/constants');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Development'
    },
    level: {
      type: String,
      enum: Object.values(COURSE_LEVELS),
      default: COURSE_LEVELS.ALL_LEVELS
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    discountPrice: {
      type: Number,
      default: null
    },
    thumbnailUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
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
    status: {
      type: String,
      enum: Object.values(COURSE_STATUS),
      default: COURSE_STATUS.PUBLISHED
    },
    totalDurationMinutes: {
      type: Number,
      default: 0
    },
    totalLessons: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.8
    },
    ratingsCount: {
      type: Number,
      default: 1
    },
    enrollmentCount: {
      type: Number,
      default: 0
    },
    requirements: [{ type: String }],
    whatYouWillLearn: [{ type: String }],
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text', category: 1 });

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
