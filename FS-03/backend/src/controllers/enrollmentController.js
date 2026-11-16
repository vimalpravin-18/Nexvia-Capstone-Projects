const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Certificate = require('../models/Certificate');
const Earnings = require('../models/Earnings');
const StudentProfile = require('../models/StudentProfile');
const InstructorProfile = require('../models/InstructorProfile');
const Notification = require('../models/Notification');
const storeAdapter = require('../config/store');
const { getDBStatus } = require('../config/db');
const { PLATFORM_FEE_PERCENTAGE } = require('../config/constants');

// @desc    Enroll in a course
// @route   POST /api/enrollments/enroll/:courseId
// @access  Private (Student)
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = (req.user._id || req.user.id).toString();
    const studentName = req.user.name;

    if (getDBStatus()) {
      let course = null;
      if (courseId && courseId.match(/^[0-9a-fA-F]{24}$/)) {
        course = await Course.findById(courseId);
      }
      if (!course) {
        course = await Course.findOne({ $or: [{ _id: courseId }, { slug: courseId }] });
      }
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      // Check if already enrolled
      let existing = await Enrollment.findOne({ studentId, courseId: course._id });
      if (existing) {
        return res.json({ success: true, message: 'Already enrolled in this course.', data: existing });
      }

      // Find first lesson as initial lastAccessedLessonId
      const firstLesson = await Lesson.findOne({ courseId: course._id }).sort({ order: 1 });

      const enrollment = await Enrollment.create({
        studentId,
        courseId: course._id,
        completedLessons: [],
        progressPercentage: 0,
        lastAccessedLessonId: firstLesson ? firstLesson._id : null,
        status: 'active'
      });

      // Increment enrollment count on course
      await Course.findByIdAndUpdate(course._id, { $inc: { enrollmentCount: 1 } });
      await StudentProfile.findOneAndUpdate({ userId: studentId }, { $inc: { enrolledCoursesCount: 1 } });

      // Calculate instructor earnings if paid course
      const price = course.discountPrice !== null ? course.discountPrice : course.price;
      if (price > 0) {
        const platformFee = Math.round((price * (PLATFORM_FEE_PERCENTAGE / 100)) * 100) / 100;
        const netInstructorAmount = Math.round((price - platformFee) * 100) / 100;

        await Earnings.create({
          instructorId: course.instructorId,
          courseId: course._id,
          courseTitle: course.title,
          studentId,
          studentName,
          grossAmount: price,
          platformFee,
          netInstructorAmount,
          status: 'cleared'
        });

        await InstructorProfile.findOneAndUpdate(
          { userId: course.instructorId },
          { $inc: { totalRevenue: netInstructorAmount, totalStudents: 1 } }
        );
      }

      await Notification.create({
        userId: studentId,
        title: 'Enrolled in Course!',
        message: `Welcome to ${course.title}. Start learning today!`,
        type: 'course',
        link: `/learn/${course._id}`
      });

      return res.status(201).json({
        success: true,
        message: 'Enrolled successfully!',
        data: enrollment
      });
    } else {
      let course = storeAdapter.findById('courses', courseId);
      if (!course) {
        course = storeAdapter.findOne('courses', { slug: courseId });
      }
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      const existing = storeAdapter.findOne('enrollments', { studentId, courseId: course._id });
      if (existing) {
        return res.json({ success: true, message: 'Already enrolled in this course.', data: existing });
      }

      const allLessons = storeAdapter.find('lessons', { courseId: course._id }).sort((a, b) => a.order - b.order);
      const firstLesson = allLessons.length > 0 ? allLessons[0] : null;

      const enrollment = storeAdapter.insertOne('enrollments', {
        studentId,
        courseId: course._id,
        completedLessons: [],
        progressPercentage: 0,
        lastAccessedLessonId: firstLesson ? firstLesson._id : null,
        status: 'active'
      });

      storeAdapter.findByIdAndUpdate('courses', course._id, { enrollmentCount: (course.enrollmentCount || 0) + 1 });

      const price = course.discountPrice !== null ? course.discountPrice : course.price;
      if (price > 0) {
        const platformFee = Math.round((price * (PLATFORM_FEE_PERCENTAGE / 100)) * 100) / 100;
        const netInstructorAmount = Math.round((price - platformFee) * 100) / 100;

        storeAdapter.insertOne('earnings', {
          instructorId: course.instructorId,
          courseId: course._id,
          courseTitle: course.title,
          studentId,
          studentName,
          grossAmount: price,
          platformFee,
          netInstructorAmount,
          status: 'cleared',
          payoutDate: new Date().toISOString()
        });
      }

      storeAdapter.insertOne('notifications', {
        userId: studentId,
        title: 'Enrolled in Course!',
        message: `Welcome to ${course.title}. Start learning today!`,
        type: 'course',
        link: `/learn/${course._id}`
      });

      return res.status(201).json({
        success: true,
        message: 'Enrolled successfully!',
        data: enrollment
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get enrolled courses for the authenticated student
// @route   GET /api/enrollments/my-courses
// @access  Private (Student)
exports.getMyEnrollments = async (req, res) => {
  try {
    const studentId = (req.user._id || req.user.id).toString();

    if (getDBStatus()) {
      const enrollments = await Enrollment.find({ studentId })
        .populate('courseId')
        .populate('lastAccessedLessonId', 'title durationFormatted')
        .sort({ updatedAt: -1 });

      return res.json({ success: true, data: enrollments });
    } else {
      const enrollments = storeAdapter.find('enrollments', { studentId });
      const enriched = enrollments.map(enr => {
        const course = storeAdapter.findById('courses', enr.courseId);
        const lastLesson = enr.lastAccessedLessonId ? storeAdapter.findById('lessons', enr.lastAccessedLessonId) : null;
        return {
          ...enr,
          courseId: course,
          lastAccessedLessonId: lastLesson
        };
      });
      enriched.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      return res.json({ success: true, data: enriched });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Mark a lesson as completed & update progress percentage
// @route   POST /api/enrollments/:courseId/lessons/:lessonId/complete
// @access  Private (Student)
exports.markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const studentId = (req.user._id || req.user.id).toString();
    const studentName = req.user.name;

    if (getDBStatus()) {
      let enrollment = await Enrollment.findOne({ studentId, courseId });
      if (!enrollment) {
        return res.status(404).json({ success: false, message: 'Enrollment not found for this course.' });
      }

      // Add lesson to completedLessons if not already present
      const alreadyCompleted = enrollment.completedLessons.some(id => id.toString() === lessonId);
      if (!alreadyCompleted) {
        enrollment.completedLessons.push(lessonId);
      }
      enrollment.lastAccessedLessonId = lessonId;

      // Calculate total lessons in course
      const totalLessonsCount = await Lesson.countDocuments({ courseId });
      const progress = totalLessonsCount > 0 
        ? Math.round((enrollment.completedLessons.length / totalLessonsCount) * 100) 
        : 100;

      enrollment.progressPercentage = Math.min(progress, 100);

      let certificateGenerated = null;
      if (enrollment.progressPercentage === 100 && enrollment.status !== 'completed') {
        enrollment.status = 'completed';
        enrollment.completedAt = new Date();

        // Generate Certificate
        const course = await Course.findById(courseId);
        const certNumber = `NEX-CERT-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        certificateGenerated = await Certificate.create({
          certificateNumber: certNumber,
          studentId,
          studentName,
          courseId,
          courseTitle: course ? course.title : 'Certified Course',
          instructorName: course ? course.instructorName : 'Nexvia Master Instructor',
          badgeColor: 'gold',
          verificationUrl: `/verify-certificate/${certNumber}`
        });

        await StudentProfile.findOneAndUpdate({ userId: studentId }, { $inc: { completedCoursesCount: 1, certificatesEarned: 1 } });

        await Notification.create({
          userId: studentId,
          title: '🎉 Course Completed & Certificate Earned!',
          message: `Congratulations! You have completed ${course ? course.title : 'the course'}. Your certificate is ready to view.`,
          type: 'certificate',
          link: `/certificates`
        });
      }

      await enrollment.save();

      return res.json({
        success: true,
        message: 'Lesson marked as completed.',
        data: {
          enrollment,
          certificate: certificateGenerated
        }
      });
    } else {
      let enrollment = storeAdapter.findOne('enrollments', { studentId, courseId });
      if (!enrollment) {
        return res.status(404).json({ success: false, message: 'Enrollment not found.' });
      }

      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }
      enrollment.lastAccessedLessonId = lessonId;

      const totalLessons = storeAdapter.find('lessons', { courseId }).length;
      const progress = totalLessons > 0 ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) : 100;
      enrollment.progressPercentage = Math.min(progress, 100);

      let certificateGenerated = null;
      if (enrollment.progressPercentage === 100 && enrollment.status !== 'completed') {
        enrollment.status = 'completed';
        enrollment.completedAt = new Date().toISOString();

        const course = storeAdapter.findById('courses', courseId);
        const certNumber = `NEX-CERT-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        certificateGenerated = storeAdapter.insertOne('certificates', {
          certificateNumber: certNumber,
          studentId,
          studentName,
          courseId,
          courseTitle: course ? course.title : 'Certified Course',
          instructorName: course ? course.instructorName : 'Nexvia Master Instructor',
          badgeColor: 'gold',
          verificationUrl: `/verify-certificate/${certNumber}`,
          issuedDate: new Date().toISOString()
        });

        storeAdapter.insertOne('notifications', {
          userId: studentId,
          title: '🎉 Course Completed & Certificate Earned!',
          message: `Congratulations! You completed ${course ? course.title : 'the course'}. Your certificate is ready!`,
          type: 'certificate',
          link: `/certificates`
        });
      }

      storeAdapter.updateOne('enrollments', { _id: enrollment._id }, enrollment);

      return res.json({
        success: true,
        message: 'Lesson marked as completed.',
        data: {
          enrollment,
          certificate: certificateGenerated
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
