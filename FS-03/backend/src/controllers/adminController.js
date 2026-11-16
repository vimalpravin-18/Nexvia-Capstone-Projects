const User = require('../models/User');
const Course = require('../models/Course');
const LiveClass = require('../models/LiveClass');
const Enrollment = require('../models/Enrollment');
const Earnings = require('../models/Earnings');
const Notification = require('../models/Notification');
const storeAdapter = require('../config/store');
const { getDBStatus } = require('../config/db');
const { getRedisStatus } = require('../config/redis');
const s3Service = require('../services/s3Service');
const { COURSE_STATUS, ROLES } = require('../config/constants');

// @desc    Get Admin Master Platform Metrics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const s3Status = s3Service.getStatus();
    const redisConnected = getRedisStatus();
    const isMongo = getDBStatus();

    const infrastructure = {
      database: {
        type: isMongo ? 'MongoDB Atlas (Cloud Cluster)' : 'Resilient Persistent JSON Store (data/lms_store.json)',
        isMongo,
        connected: true
      },
      s3: s3Status,
      redis: {
        connected: redisConnected,
        engine: redisConnected ? 'BullMQ Distributed Queue (Redis)' : 'In-Process Asynchronous Job Queue'
      }
    };

    if (isMongo) {
      const [totalStudents, totalInstructors, totalCourses, publishedCourses, liveSessions, earnings] = await Promise.all([
        User.countDocuments({ role: ROLES.STUDENT }),
        User.countDocuments({ role: ROLES.INSTRUCTOR }),
        Course.countDocuments(),
        Course.countDocuments({ status: COURSE_STATUS.PUBLISHED }),
        LiveClass.countDocuments(),
        Earnings.find()
      ]);

      const totalGrossRevenue = earnings.reduce((sum, e) => sum + (e.grossAmount || 0), 0);
      const totalPlatformCommission = earnings.reduce((sum, e) => sum + (e.platformFee || 0), 0);
      const totalInstructorPayouts = earnings.reduce((sum, e) => sum + (e.netInstructorAmount || 0), 0);

      return res.json({
        success: true,
        data: {
          totalStudents,
          totalInstructors,
          totalCourses,
          publishedCourses,
          totalLiveSessions: liveSessions,
          revenue: {
            gross: totalGrossRevenue,
            platformFee: totalPlatformCommission,
            instructorPayouts: totalInstructorPayouts
          },
          infrastructure
        }
      });
    } else {
      const users = storeAdapter.find('users');
      const courses = storeAdapter.find('courses');
      const liveClasses = storeAdapter.find('liveClasses');
      const earnings = storeAdapter.find('earnings');

      const totalStudents = users.filter(u => u.role === ROLES.STUDENT).length;
      const totalInstructors = users.filter(u => u.role === ROLES.INSTRUCTOR).length;
      const totalCourses = courses.length;
      const publishedCourses = courses.filter(c => c.status === COURSE_STATUS.PUBLISHED).length;
      const totalLiveSessions = liveClasses.length;

      const totalGrossRevenue = earnings.reduce((sum, e) => sum + (e.grossAmount || 0), 0);
      const totalPlatformCommission = earnings.reduce((sum, e) => sum + (e.platformFee || 0), 0);
      const totalInstructorPayouts = earnings.reduce((sum, e) => sum + (e.netInstructorAmount || 0), 0);

      return res.json({
        success: true,
        data: {
          totalStudents,
          totalInstructors,
          totalCourses,
          publishedCourses,
          totalLiveSessions,
          revenue: {
            gross: totalGrossRevenue,
            platformFee: totalPlatformCommission,
            instructorPayouts: totalInstructorPayouts
          },
          infrastructure
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get courses pending approval
// @route   GET /api/admin/courses/pending
// @access  Private (Admin)
exports.getPendingCourses = async (req, res) => {
  try {
    if (getDBStatus()) {
      const courses = await Course.find({
        status: { $in: [COURSE_STATUS.PENDING, COURSE_STATUS.DRAFT] }
      }).populate('instructorId', 'name email avatar');
      return res.json({ success: true, data: courses });
    } else {
      const courses = storeAdapter.find('courses').filter(c => 
        c.status === COURSE_STATUS.PENDING || c.status === COURSE_STATUS.DRAFT
      );
      const enriched = courses.map(c => {
        const inst = storeAdapter.findById('users', c.instructorId);
        return { ...c, instructorId: inst ? { name: inst.name, email: inst.email, avatar: inst.avatar } : null };
      });
      return res.json({ success: true, data: enriched });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Approve or reject a course
// @route   PATCH /api/admin/courses/:id/status
// @access  Private (Admin)
exports.updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (![COURSE_STATUS.PUBLISHED, COURSE_STATUS.REJECTED, COURSE_STATUS.DRAFT].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid course status provided.' });
    }

    if (getDBStatus()) {
      const course = await Course.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
      return res.json({ success: true, message: `Course status updated to ${status}.`, data: course });
    } else {
      const course = storeAdapter.findByIdAndUpdate('courses', req.params.id, { status });
      if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
      return res.json({ success: true, message: `Course status updated to ${status}.`, data: course });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all platform users with roles
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    if (getDBStatus()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, data: users });
    } else {
      const users = storeAdapter.find('users').map(({ password, ...u }) => u);
      return res.json({ success: true, data: users });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
