const express = require('express');
const router = express.Router();
const { getQuizByCourseId, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.get('/course/:courseId', protect, getQuizByCourseId);
router.post('/:quizId/submit', protect, submitQuiz);

module.exports = router;
