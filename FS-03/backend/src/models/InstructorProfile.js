const mongoose = require('mongoose');

const instructorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    headline: {
      type: String,
      default: 'Senior Industry Instructor'
    },
    biography: {
      type: String,
      default: ''
    },
    expertise: [{ type: String }],
    totalStudents: {
      type: Number,
      default: 0
    },
    totalCourses: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.9
    },
    payoutDetails: {
      payoutMethod: { type: String, default: 'Bank Transfer' },
      accountIdentifier: { type: String, default: '•••• •••• •••• 4242' },
      isVerified: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.InstructorProfile || mongoose.model('InstructorProfile', instructorProfileSchema);
