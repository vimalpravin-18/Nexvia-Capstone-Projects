const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseDetails,
  createCourse,
  updateCourse,
  getInstructorCourses,
  addSection,
  addLesson
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

// All course viewing endpoints require authentication
router.get('/', protect, getCourses);
router.get('/instructor/my-courses', protect, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), getInstructorCourses);
router.get('/:id', protect, getCourseDetails);

// Instructor-protected endpoints
router.post('/', protect, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), createCourse);
router.put('/:id', protect, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), updateCourse);
router.post('/:id/sections', protect, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), addSection);
router.post('/:id/sections/:sectionId/lessons', protect, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), addLesson);

module.exports = router;
