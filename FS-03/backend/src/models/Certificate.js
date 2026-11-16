const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentName: {
      type: String,
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
    instructorName: {
      type: String,
      default: 'Nexvia Certified Instructor'
    },
    issuedDate: {
      type: Date,
      default: Date.now
    },
    verificationUrl: {
      type: String,
      default: ''
    },
    pdfUrl: {
      type: String,
      default: ''
    },
    badgeColor: {
      type: String,
      default: 'gold' // 'gold' | 'purple' | 'blue'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);
