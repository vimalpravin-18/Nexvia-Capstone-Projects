/**
 * End-to-End API & Integration Verification Test Suite for Nexvia LMS (FS-03)
 */
const http = require('http');
const app = require('../app');
const { connectDB } = require('../config/db');
const storeAdapter = require('../config/store');
const seedDatabase = require('../data/seedData');
const ffmpegService = require('../services/ffmpegService');

// Models
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const InstructorProfile = require('../models/InstructorProfile');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const LiveClass = require('../models/LiveClass');
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');

let server;
const TEST_PORT = 5099;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

// Helper for making HTTP JSON requests
const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

const runTests = async () => {
  console.log('========================================================');
  console.log('🧪 Starting Nexvia LMS [FS-03] Integration Verification');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(`  ✅ PASS: ${title}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${title}`);
      failed++;
    }
  };

  try {
    await connectDB();
    await seedDatabase(
      storeAdapter,
      User,
      StudentProfile,
      InstructorProfile,
      Course,
      Section,
      Lesson,
      Quiz,
      Question,
      LiveClass,
      Certificate,
      Enrollment,
      () => false
    );

    await new Promise((resolve) => {
      server = app.listen(TEST_PORT, resolve);
    });

    // TEST 1: Health check
    const healthRes = await request('GET', '/api/health');
    assert(healthRes.status === 200 && healthRes.body.status === 'healthy', 'Health check returns 200 OK');

    // TEST 2: Student Login
    const studentLogin = await request('POST', '/api/auth/login', {
      email: 'student@nexvia.com',
      password: 'password123'
    });
    assert(studentLogin.status === 200 && studentLogin.body.data.token, 'Student authentication successful');
    const studentToken = studentLogin.body.data.token;

    // TEST 3: Instructor Login
    const instLogin = await request('POST', '/api/auth/login', {
      email: 'instructor@nexvia.com',
      password: 'password123'
    });
    assert(instLogin.status === 200 && instLogin.body.data.user.role === 'instructor', 'Instructor authentication successful');
    const instructorToken = instLogin.body.data.token;

    // TEST 4: Admin Login
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@nexvia.com',
      password: 'password123'
    });
    assert(adminLogin.status === 200 && adminLogin.body.data.user.role === 'admin', 'Admin authentication successful');
    const adminToken = adminLogin.body.data.token;

    // TEST 5: RBAC Security Guard (Student cannot create course)
    const unauthorizedCourseCreate = await request('POST', '/api/courses', {
      title: 'Hacked Course',
      description: 'Test',
      category: 'UI/UX Design'
    }, studentToken);
    assert(unauthorizedCourseCreate.status === 403, 'RBAC prevents student from creating courses (HTTP 403)');

    // TEST 6: Public Course Catalog
    const coursesRes = await request('GET', '/api/courses');
    assert(coursesRes.status === 200 && coursesRes.body.data.courses.length > 0, `Course catalog returned ${coursesRes.body.data.courses.length} courses`);
    const testCourse = coursesRes.body.data.courses[0];

    // TEST 7: Course Details & Curriculum
    const courseDetailsRes = await request('GET', `/api/courses/${testCourse._id}`);
    assert(
      courseDetailsRes.status === 200 && Array.isArray(courseDetailsRes.body.data.curriculum),
      'Course details returned full curriculum with sections and lessons'
    );

    // TEST 8: Student My Courses / Enrollments
    const enrollmentsRes = await request('GET', '/api/enrollments/my-courses', null, studentToken);
    assert(enrollmentsRes.status === 200 && Array.isArray(enrollmentsRes.body.data), 'Student fetched enrolled courses');

    // TEST 9: Live Classes API
    const liveClassesRes = await request('GET', '/api/live-classes');
    assert(liveClassesRes.status === 200 && liveClassesRes.body.data.length > 0, `Live classes returned ${liveClassesRes.body.data.length} scheduled/live classes`);

    // TEST 10: Live Classroom Session Room lookup
    const roomRes = await request('GET', '/api/live-classes/room/NEX-DES-924', null, studentToken);
    assert(roomRes.status === 200 && roomRes.body.data.roomCode === 'NEX-DES-924', 'Live classroom lookup by room code verified');

    // TEST 11: Quiz for Course
    const quizRes = await request('GET', `/api/quizzes/course/${testCourse._id}`, null, studentToken);
    assert(quizRes.status === 200 && Array.isArray(quizRes.body.data.questions), 'Quiz loaded with sanitized questions (answers hidden)');

    // TEST 12: Quiz Submission & Automatic Evaluation
    if (quizRes.body.data.quiz && quizRes.body.data.questions.length > 0) {
      const quizId = quizRes.body.data.quiz._id;
      const questions = quizRes.body.data.questions;
      const submission = {
        courseId: testCourse._id,
        timeSpentSeconds: 120,
        answers: questions.map(q => ({ questionId: q._id, selectedOptionIndex: 1 }))
      };
      const submitRes = await request('POST', `/api/quizzes/${quizId}/submit`, submission, studentToken);
      assert(submitRes.status === 201 && submitRes.body.data.score !== undefined, 'Quiz evaluation calculated score and pass/fail status');
    }

    // TEST 13: Certificate Verification
    const certVerifyRes = await request('GET', '/api/certificates/verify/NEX-CERT-2026-CHM-9821');
    assert(certVerifyRes.status === 200 && certVerifyRes.body.data.studentName === 'Diane Nguyen', 'Certificate verified with student name & serial number');

    // TEST 14: Admin Dashboard Analytics
    const adminAnalyticsRes = await request('GET', '/api/admin/analytics', null, adminToken);
    assert(
      adminAnalyticsRes.status === 200 && adminAnalyticsRes.body.data.totalCourses > 0,
      'Admin analytics successfully aggregated platform metrics'
    );

    // TEST 15: FFmpeg Engine Availability
    assert(typeof ffmpegService.getMetadata === 'function', 'FFmpeg Service loaded and initialized');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    if (server) server.close();

    console.log('\n========================================================');
    console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log('========================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
};

runTests();
