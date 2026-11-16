const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getPendingCourses,
  updateCourseStatus,
  getAllUsers
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

// All admin routes protected with ADMIN role
router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.get('/analytics', getDashboardAnalytics);
router.get('/courses/pending', getPendingCourses);
router.patch('/courses/:id/status', updateCourseStatus);
router.get('/users', getAllUsers);

module.exports = router;
