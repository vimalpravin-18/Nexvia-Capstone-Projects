/**
 * Application Constants & Enums for Nexvia LMS
 */
const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin'
};

const COURSE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending_approval',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
  ARCHIVED: 'archived'
};

const COURSE_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  ALL_LEVELS: 'All Levels'
};

const LESSON_TYPES = {
  VIDEO: 'video',
  READING: 'reading',
  QUIZ: 'quiz'
};

const LIVE_CLASS_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const MEDIA_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

const EARNINGS_STATUS = {
  PENDING: 'pending',
  CLEARED: 'cleared',
  WITHDRAWN: 'withdrawn'
};

const PLATFORM_FEE_PERCENTAGE = 15; // 15% platform commission, 85% instructor payout

module.exports = {
  ROLES,
  COURSE_STATUS,
  COURSE_LEVELS,
  LESSON_TYPES,
  LIVE_CLASS_STATUS,
  MEDIA_STATUS,
  EARNINGS_STATUS,
  PLATFORM_FEE_PERCENTAGE
};
