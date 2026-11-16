const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const storeAdapter = require('../config/store');
const { getDBStatus } = require('../config/db');

// @desc    Get quiz for a course with questions (safe: hide isCorrect from student)
// @route   GET /api/quizzes/course/:courseId
// @access  Private
exports.getQuizByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (getDBStatus()) {
      const quiz = await Quiz.findOne({ courseId });
      if (!quiz) {
        return res.status(404).json({ success: false, message: 'No quiz found for this course.' });
      }

      const questions = await Question.find({ quizId: quiz._id }).sort({ order: 1 });

      // Sanitize: strip `isCorrect` before sending to student
      const sanitizedQuestions = questions.map(q => ({
        _id: q._id,
        quizId: q.quizId,
        questionText: q.questionText,
        options: q.options.map(o => ({ text: o.text })),
        points: q.points,
        order: q.order
      }));

      return res.json({
        success: true,
        data: {
          quiz,
          questions: sanitizedQuestions
        }
      });
    } else {
      const quiz = storeAdapter.findOne('quizzes', { courseId });
      if (!quiz) {
        return res.status(404).json({ success: false, message: 'No quiz found for this course.' });
      }

      const questions = storeAdapter.find('questions', { quizId: quiz._id }).sort((a, b) => a.order - b.order);

      const sanitizedQuestions = questions.map(q => ({
        _id: q._id,
        quizId: q.quizId,
        questionText: q.questionText,
        options: q.options.map(o => ({ text: o.text })),
        points: q.points,
        order: q.order
      }));

      return res.json({
        success: true,
        data: {
          quiz,
          questions: sanitizedQuestions
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit quiz answers and evaluate score
// @route   POST /api/quizzes/:quizId/submit
// @access  Private (Student)
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers, courseId, timeSpentSeconds = 0 } = req.body;
    const studentId = (req.user._id || req.user.id).toString();

    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required.' });
    }

    if (getDBStatus()) {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });

      const questions = await Question.find({ quizId });
      let totalEarnedScore = 0;
      let totalPossibleScore = 0;
      const evaluatedAnswers = [];

      questions.forEach(q => {
        const points = q.points || 10;
        totalPossibleScore += points;

        const studentAns = answers.find(a => a.questionId.toString() === q._id.toString());
        const selectedIndex = studentAns ? studentAns.selectedOptionIndex : -1;

        const isCorrect = selectedIndex >= 0 && q.options[selectedIndex] && q.options[selectedIndex].isCorrect;

        if (isCorrect) {
          totalEarnedScore += points;
        }

        evaluatedAnswers.push({
          questionId: q._id,
          selectedOptionIndex: selectedIndex,
          isCorrect: Boolean(isCorrect)
        });
      });

      const percentage = totalPossibleScore > 0 ? Math.round((totalEarnedScore / totalPossibleScore) * 100) : 0;
      const passed = percentage >= (quiz.passingScorePercentage || 70);

      const attempt = await QuizAttempt.create({
        quizId,
        studentId,
        courseId: courseId || quiz.courseId,
        answers: evaluatedAnswers,
        score: totalEarnedScore,
        totalPossibleScore,
        percentage,
        passed,
        timeSpentSeconds
      });

      return res.status(201).json({
        success: true,
        message: passed ? 'Congratulations! You passed the quiz.' : 'You did not meet the passing criteria. Please try again.',
        data: {
          attempt,
          score: totalEarnedScore,
          totalPossibleScore,
          percentage,
          passed,
          passingScorePercentage: quiz.passingScorePercentage
        }
      });
    } else {
      const quiz = storeAdapter.findById('quizzes', quizId);
      if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });

      const questions = storeAdapter.find('questions', { quizId });
      let totalEarnedScore = 0;
      let totalPossibleScore = 0;
      const evaluatedAnswers = [];

      questions.forEach(q => {
        const points = q.points || 10;
        totalPossibleScore += points;

        const studentAns = answers.find(a => a.questionId.toString() === q._id.toString());
        const selectedIndex = studentAns ? studentAns.selectedOptionIndex : -1;

        const isCorrect = selectedIndex >= 0 && q.options[selectedIndex] && q.options[selectedIndex].isCorrect;

        if (isCorrect) totalEarnedScore += points;

        evaluatedAnswers.push({
          questionId: q._id,
          selectedOptionIndex: selectedIndex,
          isCorrect: Boolean(isCorrect)
        });
      });

      const percentage = totalPossibleScore > 0 ? Math.round((totalEarnedScore / totalPossibleScore) * 100) : 0;
      const passed = percentage >= (quiz.passingScorePercentage || 70);

      const attempt = storeAdapter.insertOne('quizAttempts', {
        quizId,
        studentId,
        courseId: courseId || quiz.courseId,
        answers: evaluatedAnswers,
        score: totalEarnedScore,
        totalPossibleScore,
        percentage,
        passed,
        timeSpentSeconds
      });

      return res.status(201).json({
        success: true,
        message: passed ? 'Congratulations! You passed the quiz.' : 'You did not meet the passing criteria. Please try again.',
        data: {
          attempt,
          score: totalEarnedScore,
          totalPossibleScore,
          percentage,
          passed,
          passingScorePercentage: quiz.passingScorePercentage
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
