const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  markLessonComplete
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');

router.post('/enroll/:courseId', protect, enrollCourse);
router.get('/my-courses', protect, getMyEnrollments);
router.post('/:courseId/lessons/:lessonId/complete', protect, markLessonComplete);

module.exports = router;
