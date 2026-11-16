/**
 * Rich Initial Seed Data for Nexvia LMS
 * Populates realistic courses, lessons, quizzes, certificates, and live classes matching the reference designs.
 */
const bcrypt = require('bcryptjs');
const { ROLES, COURSE_STATUS, COURSE_LEVELS, LIVE_CLASS_STATUS } = require('../config/constants');

const SAMPLE_VIDEOS = {
  BIG_BUCK: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  ELEPHANTS: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  BLAZES: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  ESCAPES: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  FUN: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  JOY: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  MELTDOWNS: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  SINTEL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  SUBARU: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  TEARS: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  BULLRUN: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  CAR_GRAND: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
};

const COURSE_CURRICULUMS = [
  {
    // Course 0: Design Thinking Fundamentals
    sections: [
      {
        title: 'Stage 1: Introduction to Design Thinking',
        lessons: [
          {
            title: 'Introduction to Design Thinking',
            videoUrl: SAMPLE_VIDEOS.BIG_BUCK,
            durationMinutes: 7,
            durationFormatted: '06:47',
            description: 'Master the essentials of design thinking through real-world case studies and frameworks.',
            transcriptNotes: [
              { timestamp: '01:10', text: 'Design thinking is a human-centered approach to problem solving.' },
              { timestamp: '03:45', text: 'The 5 stages: Empathize, Define, Ideate, Prototype, and Test.' },
              { timestamp: '05:30', text: 'Setting up user discovery interviews.' }
            ]
          },
          {
            title: 'Empathize with Users & Research Methodologies',
            videoUrl: SAMPLE_VIDEOS.ELEPHANTS,
            durationMinutes: 22,
            durationFormatted: '22:40',
            description: 'Learn how to observe, engage, and empathize with users to discover latent motivations.',
            transcriptNotes: [
              { timestamp: '04:20', text: 'Conducting non-leading interviews.' },
              { timestamp: '12:15', text: 'Mapping customer journey emotion states.' },
              { timestamp: '18:50', text: 'Synthesizing observational field notes.' }
            ]
          },
          {
            title: 'Define the Core Problem Statement',
            videoUrl: SAMPLE_VIDEOS.BLAZES,
            durationMinutes: 35,
            durationFormatted: '35:18',
            description: 'Structure insights into an actionable Point of View (POV) and generate How Might We questions.',
            transcriptNotes: [
              { timestamp: '05:12', text: 'Crafting user-centric problem statements.' },
              { timestamp: '20:30', text: 'Avoiding solution bias in the definition phase.' }
            ]
          }
        ]
      },
      {
        title: 'Stage 2: Ideation, Prototyping & Testing',
        lessons: [
          {
            title: 'Ideate Innovative Solutions & Brainstorming',
            videoUrl: SAMPLE_VIDEOS.FUN,
            durationMinutes: 18,
            durationFormatted: '18:12',
            description: 'Brainstorm creative possibilities without premature judgment or technical constraints.',
            transcriptNotes: [
              { timestamp: '02:40', text: 'Divergent vs convergent thinking techniques.' },
              { timestamp: '10:15', text: 'Crazy Eights and rapid sketch exercises.' }
            ]
          },
          {
            title: 'Rapid Interactive Prototyping',
            videoUrl: SAMPLE_VIDEOS.JOY,
            durationMinutes: 24,
            durationFormatted: '24:30',
            description: 'Build tangible mockups and low-fidelity prototypes to test hypotheses quickly.',
            transcriptNotes: [
              { timestamp: '06:00', text: 'Paper prototyping vs interactive Figma components.' },
              { timestamp: '17:20', text: 'Simulating product flows.' }
            ]
          },
          {
            title: 'Usability Testing & Iteration with Stakeholders',
            videoUrl: SAMPLE_VIDEOS.ESCAPES,
            durationMinutes: 15,
            durationFormatted: '14:50',
            description: 'Put prototypes in front of real users, capture qualitative feedback, and iterate.',
            transcriptNotes: [
              { timestamp: '03:15', text: 'Test script preparation and task metrics.' },
              { timestamp: '11:40', text: 'Iterating on feedback without starting from scratch.' }
            ]
          }
        ]
      }
    ]
  },
  {
    // Course 1: Drone Flight Basics
    sections: [
      {
        title: 'Stage 1: Drone Aerodynamics & Flight Physics',
        lessons: [
          {
            title: 'Introduction to Drone Aerodynamics',
            videoUrl: SAMPLE_VIDEOS.TEARS,
            durationMinutes: 12,
            durationFormatted: '12:30',
            description: 'Essential aerodynamic principles of stable flight, thrust-to-weight ratios, and safe drone control.',
            transcriptNotes: [
              { timestamp: '01:30', text: 'Four forces of flight: Lift, Weight, Thrust, and Drag.' },
              { timestamp: '07:15', text: 'Quadcopter yaw, pitch, and roll dynamics.' }
            ]
          },
          {
            title: 'Propeller Aerodynamics & Blade Pitch',
            videoUrl: SAMPLE_VIDEOS.MELTDOWNS,
            durationMinutes: 16,
            durationFormatted: '15:45',
            description: 'Comparing 2-blade vs 3-blade props, pitch effects on battery drain, and top-speed efficiency.',
            transcriptNotes: [
              { timestamp: '03:00', text: 'Propeller diameter vs KV rating compatibility.' }
            ]
          }
        ]
      },
      {
        title: 'Stage 2: Drone Structure & Components',
        lessons: [
          {
            title: 'Motors & Propulsion Systems',
            videoUrl: SAMPLE_VIDEOS.SUBARU,
            durationMinutes: 17,
            durationFormatted: '16:57',
            description: 'Brushless DC motor stator size, magnet strength, and power generation.',
            transcriptNotes: [
              { timestamp: '04:10', text: 'Brushless motor KV and stator sizes (e.g. 2207 vs 2306).' },
              { timestamp: '11:20', text: 'Thermal dissipation and motor bearing maintenance.' }
            ]
          },
          {
            title: 'Electronic Speed Controllers (ESC)',
            videoUrl: SAMPLE_VIDEOS.BULLRUN,
            durationMinutes: 41,
            durationFormatted: '41:05',
            description: '4-in-1 ESC architectures, BLHeli_32/Bluejay firmware, and DShot600 communication protocols.',
            transcriptNotes: [
              { timestamp: '10:30', text: 'PWM vs DShot digital protocols.' },
              { timestamp: '25:00', text: 'Current sensing and burst amp ratings.' }
            ]
          },
          {
            title: 'Understanding the Core Frame Design',
            videoUrl: SAMPLE_VIDEOS.CAR_GRAND,
            durationMinutes: 49,
            durationFormatted: '48:57',
            description: 'Carbon fiber weaves, resonance damping, arm geometry (True-X vs Deadcat), and CG balance.',
            transcriptNotes: [
              { timestamp: '12:00', text: 'Center of gravity alignment with battery placement.' },
              { timestamp: '34:10', text: 'Vibration isolation for flight controller gyros.' }
            ]
          },
          {
            title: 'Battery & Power Distribution Board',
            videoUrl: SAMPLE_VIDEOS.SINTEL,
            durationMinutes: 52,
            durationFormatted: '51:32',
            description: 'LiPo cell chemistry (4S vs 6S), C-rating discharge rates, voltage regulators, and capacitor filtering.',
            transcriptNotes: [
              { timestamp: '15:40', text: 'Low ESR capacitors to prevent video voltage spikes.' },
              { timestamp: '38:10', text: 'Safe storage voltage and charging procedures.' }
            ]
          }
        ]
      },
      {
        title: 'Stage 3: Flight Controller Sensors & Telemetry',
        lessons: [
          {
            title: 'Flight Controller Gyro & Accelerometer Filtering',
            videoUrl: SAMPLE_VIDEOS.JOY,
            durationMinutes: 23,
            durationFormatted: '23:10',
            description: 'PID loops, gyro filtering (RPM filters), and flight stabilization algorithms in Betaflight.',
            transcriptNotes: [
              { timestamp: '05:30', text: 'Configuring notch and lowpass filters.' }
            ]
          },
          {
            title: 'GPS, Barometer and Failsafe Return-to-Home',
            videoUrl: SAMPLE_VIDEOS.ESCAPES,
            durationMinutes: 31,
            durationFormatted: '31:20',
            description: 'Setting up satellite acquisition, barometric altitude hold, and autonomous rescue modes.',
            transcriptNotes: [
              { timestamp: '14:20', text: 'Failsafe switch testing and GPS lock thresholds.' }
            ]
          }
        ]
      }
    ]
  },
  {
    // Course 2: UI/UX Design Level Up with Prototyping
    sections: [
      {
        title: 'Stage 1: Design Systems & Architecture',
        lessons: [
          {
            title: 'Design Tokens, Color Palettes & Type Scales',
            videoUrl: SAMPLE_VIDEOS.FUN,
            durationMinutes: 18,
            durationFormatted: '18:25',
            description: 'Constructing robust semantic design tokens for light/dark mode and enterprise multi-brand systems.',
            transcriptNotes: [
              { timestamp: '04:15', text: 'Semantic tokens vs raw primitive values.' }
            ]
          },
          {
            title: 'Atomic Components & Figma Auto-Layout v5',
            videoUrl: SAMPLE_VIDEOS.BIG_BUCK,
            durationMinutes: 28,
            durationFormatted: '28:40',
            description: 'Building flexible component variants with nested properties, slot components, and fluid responsive constraints.',
            transcriptNotes: [
              { timestamp: '09:30', text: 'Auto-layout wrap and min/max dimensions.' }
            ]
          }
        ]
      },
      {
        title: 'Stage 2: High-Fidelity Interactive Prototyping',
        lessons: [
          {
            title: 'Smart Animate & Interactive Micro-States',
            videoUrl: SAMPLE_VIDEOS.ELEPHANTS,
            durationMinutes: 32,
            durationFormatted: '32:15',
            description: 'Creating realistic micro-interactions, spring physics, and animated transitions in Figma.',
            transcriptNotes: [
              { timestamp: '08:00', text: 'Spring easing curves for natural touch feedback.' }
            ]
          },
          {
            title: 'Usability Heuristics & Conversion Testing',
            videoUrl: SAMPLE_VIDEOS.BLAZES,
            durationMinutes: 26,
            durationFormatted: '25:50',
            description: 'Applying Nielsen Norman 10 heuristics to eliminate friction in SaaS checkout and onboarding funnels.',
            transcriptNotes: [
              { timestamp: '07:20', text: 'Error prevention vs error recovery mechanisms.' }
            ]
          },
          {
            title: 'Developer Handoff & Design Systems Governance',
            videoUrl: SAMPLE_VIDEOS.TEARS,
            durationMinutes: 20,
            durationFormatted: '19:35',
            description: 'Annotating component specs, exporting token JSON, and syncing with React Tailwind stylesheets.',
            transcriptNotes: [
              { timestamp: '05:40', text: 'Design token JSON pipeline for frontend synchronization.' }
            ]
          }
        ]
      }
    ]
  },
  {
    // Course 3: Full Stack JavaScript & Cloud Development
    sections: [
      {
        title: 'Stage 1: Express REST & Real-time WebRTC',
        lessons: [
          {
            title: 'Full-Stack Architecture & Express REST APIs',
            videoUrl: SAMPLE_VIDEOS.CAR_GRAND,
            durationMinutes: 27,
            durationFormatted: '27:15',
            description: 'Structuring clean MVC Express applications with centralized error handling, Joi validation, and JWT authentication.',
            transcriptNotes: [
              { timestamp: '06:10', text: 'Express middleware chains and secure route guards.' }
            ]
          },
          {
            title: 'MongoDB Schema Modeling & Aggregation Pipelines',
            videoUrl: SAMPLE_VIDEOS.BULLRUN,
            durationMinutes: 35,
            durationFormatted: '34:40',
            description: 'Indexing strategies, schema validation, relationship modeling, and aggregation stages for analytics.',
            transcriptNotes: [
              { timestamp: '12:40', text: 'Compound indexes for fast queries.' }
            ]
          },
          {
            title: 'WebRTC Peer Connections & Video Signaling Sockets',
            videoUrl: SAMPLE_VIDEOS.SUBARU,
            durationMinutes: 42,
            durationFormatted: '42:10',
            description: 'Building peer-to-peer live classrooms with Socket.io signaling, SDP offer/answer relay, and ICE candidate exchange.',
            transcriptNotes: [
              { timestamp: '14:00', text: 'SDP negotiation and NAT traversal with STUN/TURN.' }
            ]
          }
        ]
      },
      {
        title: 'Stage 2: Media Processing, Background Jobs & CloudFront CDN',
        lessons: [
          {
            title: 'FFmpeg Video Transcoding & HLS Streaming',
            videoUrl: SAMPLE_VIDEOS.MELTDOWNS,
            durationMinutes: 30,
            durationFormatted: '29:30',
            description: 'Implementing fluent-ffmpeg pipelines, generating video thumbnails, and faststart MP4 optimization.',
            transcriptNotes: [
              { timestamp: '08:20', text: 'MP4 moov atom placement and HLS master playlists.' }
            ]
          },
          {
            title: 'AWS S3 & CloudFront Edge CDN Delivery',
            videoUrl: SAMPLE_VIDEOS.SINTEL,
            durationMinutes: 31,
            durationFormatted: '31:15',
            description: 'Configuring Amazon CloudFront distributions, cache policies, signed cookies, and origin access control.',
            transcriptNotes: [
              { timestamp: '11:15', text: 'CloudFront OAC security and edge caching.' }
            ]
          },
          {
            title: 'BullMQ Background Queues with Redis',
            videoUrl: SAMPLE_VIDEOS.JOY,
            durationMinutes: 27,
            durationFormatted: '26:50',
            description: 'Managing asynchronous background queues for video transcoding jobs, notifications, and PDF certificate generation.',
            transcriptNotes: [
              { timestamp: '09:40', text: 'BullMQ job concurrency, retries, and rate limiting.' }
            ]
          }
        ]
      }
    ]
  }
];

const seedDatabase = async (storeAdapter, User, StudentProfile, InstructorProfile, Course, Section, Lesson, Quiz, Question, LiveClass, Certificate, Enrollment, getDBStatus) => {
  const isMongo = getDBStatus();

  // Check if already seeded
  if (isMongo) {
    const userCount = await User.countDocuments();
    if (userCount > 0) return;
  } else {
    const existingUsers = storeAdapter.find('users');
    if (existingUsers.length > 0) return;
  }

  console.log('[Seed] Seeding LMS database with initial users, courses, lessons, and live classes...');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // 1. Initial Users
  const studentUser = {
    _id: isMongo ? undefined : 'usr_student_01',
    name: 'Diane Nguyen',
    email: 'student@nexvia.com',
    password: passwordHash,
    role: ROLES.STUDENT,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: '2nd Year Computer Science & Design Student',
    bio: 'Passionate student learning modern full-stack engineering, UI/UX prototyping, and cloud computing.',
    isActive: true
  };

  const instructorUser = {
    _id: isMongo ? undefined : 'usr_instructor_01',
    name: 'Jenny Wilson',
    email: 'instructor@nexvia.com',
    password: passwordHash,
    role: ROLES.INSTRUCTOR,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Product Designer & Tech Lead',
    bio: 'Ex-Google Design Lead with 10+ years designing enterprise digital products and teaching over 40,000 students worldwide.',
    isActive: true
  };

  const adminUser = {
    _id: isMongo ? undefined : 'usr_admin_01',
    name: 'Nexvia Platform Admin',
    email: 'admin@nexvia.com',
    password: passwordHash,
    role: ROLES.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'System Administrator & Evaluation Lead',
    bio: 'Managing academic governance, instructor payouts, and course curriculum quality control.',
    isActive: true
  };

  let savedStudent, savedInstructor, savedAdmin;

  if (isMongo) {
    savedStudent = await User.create({ ...studentUser, password: 'password123' });
    savedInstructor = await User.create({ ...instructorUser, password: 'password123' });
    savedAdmin = await User.create({ ...adminUser, password: 'password123' });

    await StudentProfile.create({
      userId: savedStudent._id,
      enrolledCoursesCount: 3,
      completedCoursesCount: 2,
      certificatesEarned: 2,
      weeklyGoalPercentage: 85,
      streakDays: 5
    });

    await InstructorProfile.create({
      userId: savedInstructor._id,
      headline: 'Senior Product Designer & Tech Lead',
      biography: 'Ex-Google Design Lead with 10+ years designing enterprise digital products.',
      expertise: ['UI/UX Design', 'Design Thinking', 'Prototyping', 'Design Systems'],
      totalStudents: 1420,
      totalCourses: 4,
      totalRevenue: 8450,
      rating: 4.9
    });
  } else {
    savedStudent = storeAdapter.insertOne('users', studentUser);
    savedInstructor = storeAdapter.insertOne('users', instructorUser);
    savedAdmin = storeAdapter.insertOne('users', adminUser);

    storeAdapter.insertOne('studentProfiles', {
      userId: savedStudent._id,
      enrolledCoursesCount: 3,
      completedCoursesCount: 2,
      certificatesEarned: 2,
      weeklyGoalPercentage: 85,
      streakDays: 5
    });

    storeAdapter.insertOne('instructorProfiles', {
      userId: savedInstructor._id,
      headline: 'Senior Product Designer & Tech Lead',
      biography: 'Ex-Google Design Lead with 10+ years designing enterprise digital products.',
      expertise: ['UI/UX Design', 'Design Thinking', 'Prototyping', 'Design Systems'],
      totalStudents: 1420,
      totalCourses: 4,
      totalRevenue: 8450,
      rating: 4.9
    });
  }

  // 2. Initial Courses
  const instructorId = savedInstructor._id;

  const coursesData = [
    {
      title: 'Design Thinking Fundamentals',
      slug: 'design-thinking-fundamentals',
      subtitle: 'Master human-centered problem solving and rapid prototyping',
      description: 'This class is designed to help you master the essentials of design thinking. Through practical lessons and real-world case studies, you will learn how to solve problems creatively and build impactful solutions.',
      category: 'UI/UX Design',
      level: COURSE_LEVELS.BEGINNER,
      price: 69.99,
      discountPrice: 49.99,
      thumbnailUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
      instructorId: instructorId,
      instructorName: savedInstructor.name,
      status: COURSE_STATUS.PUBLISHED,
      totalDurationMinutes: 504,
      totalLessons: 6,
      rating: 4.8,
      ratingsCount: 244,
      enrollmentCount: 842,
      requirements: ['No prior design experience required', 'Open mindset for creative problem solving'],
      whatYouWillLearn: [
        'Understand the 5 stages of design thinking',
        'Learn structured user ideation and research techniques',
        'Empathy-driven problem definition and scoping',
        'Build and test rapid interactive mockups'
      ]
    },
    {
      title: 'Drone Flight Basics: Core Structure & Aerodynamics',
      slug: 'drone-flight-basics',
      subtitle: 'Learn the essential principles of stable flight and safe drone control',
      description: 'Drones combine lightweight design, precise aerodynamics, and advanced electronics to achieve stable flight and responsive control. In this lesson, we will explore how engineers design drone frames for strength without sacrificing agility.',
      category: 'Hardware & Robotics',
      level: COURSE_LEVELS.INTERMEDIATE,
      price: 89.99,
      discountPrice: 59.99,
      thumbnailUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
      instructorId: instructorId,
      instructorName: savedInstructor.name,
      status: COURSE_STATUS.PUBLISHED,
      totalDurationMinutes: 420,
      totalLessons: 8,
      rating: 4.8,
      ratingsCount: 312,
      enrollmentCount: 650,
      requirements: ['Basic understanding of DC electronics', 'A computer running Betaflight configurator'],
      whatYouWillLearn: [
        'Frame geometry, weight balance, and carbon fiber properties',
        'Brushless motor dynamics, stator sizes, and KV ratings',
        'Electronic Speed Controllers (ESC) and DShot protocols',
        'Flight controller sensor calibration and failsafe procedures'
      ]
    },
    {
      title: 'UI/UX Design Level Up with Prototyping',
      slug: 'ui-ux-design-level-up',
      subtitle: 'Build production-ready design systems and interactive Figma micro-interactions',
      description: 'Transform static wireframes into captivating high-fidelity interactive user experiences. Learn industry standards for atomic components, variables, and dev handoff.',
      category: 'UI/UX Design',
      level: COURSE_LEVELS.INTERMEDIATE,
      price: 99.00,
      discountPrice: 65.00,
      thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
      instructorId: instructorId,
      instructorName: savedInstructor.name,
      status: COURSE_STATUS.PUBLISHED,
      totalDurationMinutes: 540,
      totalLessons: 5,
      rating: 4.9,
      ratingsCount: 189,
      enrollmentCount: 920,
      requirements: ['Figma free account', 'Basic understanding of UI wireframing'],
      whatYouWillLearn: [
        'Design systems architecture from tokens to organisms',
        'Smart animate and advanced interactive components in Figma',
        'Accessible color contrast and WCAG 2.1 AA standards'
      ]
    },
    {
      title: 'Full Stack JavaScript & Cloud Development',
      slug: 'full-stack-javascript-development',
      subtitle: 'Build and deploy scalable MERN applications with real-time WebSockets',
      description: 'End-to-end full stack web architecture course covering React 19, Node.js REST APIs, MongoDB aggregation pipelines, Redis caching, and WebRTC streaming.',
      category: 'Web Development',
      level: COURSE_LEVELS.ADVANCED,
      price: 120.00,
      discountPrice: 75.00,
      thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80',
      instructorId: instructorId,
      instructorName: savedInstructor.name,
      status: COURSE_STATUS.PUBLISHED,
      totalDurationMinutes: 680,
      totalLessons: 6,
      rating: 5.0,
      ratingsCount: 420,
      enrollmentCount: 1120,
      requirements: ['JavaScript ES6+ fundamentals'],
      whatYouWillLearn: [
        'Building production-ready Express REST APIs',
        'MongoDB schema modeling and indexing strategies',
        'Real-time peer-to-peer WebSockets and WebRTC media streams'
      ]
    }
  ];

  let firstCourseSaved = null;
  let firstCourseLessons = [];

  for (let cIdx = 0; cIdx < coursesData.length; cIdx++) {
    const cData = coursesData[cIdx];
    let course;
    if (isMongo) {
      course = await Course.create(cData);
    } else {
      course = storeAdapter.insertOne('courses', cData);
    }

    if (cIdx === 0) firstCourseSaved = course;

    const curriculum = COURSE_CURRICULUMS[cIdx] || COURSE_CURRICULUMS[0];

    for (let sIdx = 0; sIdx < curriculum.sections.length; sIdx++) {
      const sDef = curriculum.sections[sIdx];
      let section;
      if (isMongo) {
        section = await Section.create({
          courseId: course._id,
          title: sDef.title,
          order: sIdx + 1
        });
      } else {
        section = storeAdapter.insertOne('sections', {
          courseId: course._id,
          title: sDef.title,
          order: sIdx + 1
        });
      }

      for (let lIdx = 0; lIdx < sDef.lessons.length; lIdx++) {
        const lDef = sDef.lessons[lIdx];
        const lessonPayload = {
          courseId: course._id,
          sectionId: section._id,
          title: lDef.title,
          type: 'video',
          videoUrl: lDef.videoUrl,
          durationMinutes: lDef.durationMinutes,
          durationFormatted: lDef.durationFormatted,
          order: lIdx + 1,
          isFreePreview: lIdx === 0,
          description: lDef.description,
          transcriptNotes: lDef.transcriptNotes
        };

        let savedLesson;
        if (isMongo) {
          savedLesson = await Lesson.create(lessonPayload);
        } else {
          savedLesson = storeAdapter.insertOne('lessons', lessonPayload);
        }

        if (cIdx === 0) firstCourseLessons.push(savedLesson);
      }
    }

    // Create a Quiz for this course
    const quizPayload = {
      courseId: course._id,
      title: `${course.title} — Certification Quiz`,
      description: 'Test your mastery of foundational concepts covered in the course curriculum.',
      passingScorePercentage: 70,
      timeLimitMinutes: 15,
      totalQuestions: 3
    };

    let quiz;
    if (isMongo) {
      quiz = await Quiz.create(quizPayload);
      await Question.create([
        {
          quizId: quiz._id,
          questionText: 'What is the primary objective of the "Empathize" stage in design thinking?',
          options: [
            { text: 'To write product documentation and software unit tests', isCorrect: false },
            { text: 'To understand user needs, emotions, and pain points without assumptions', isCorrect: true },
            { text: 'To create high-fidelity UI components in Figma', isCorrect: false },
            { text: 'To set up AWS CloudFront distributions', isCorrect: false }
          ],
          points: 10,
          order: 1
        },
        {
          quizId: quiz._id,
          questionText: 'Why is FFmpeg faststart (-movflags +faststart) crucial for web video streaming?',
          options: [
            { text: 'It compresses audio into 8-bit mono channels', isCorrect: false },
            { text: 'It relocates the MP4 moov metadata atom to the beginning of the file for instant playback', isCorrect: true },
            { text: 'It disables video seeking during playback', isCorrect: false },
            { text: 'It generates vector thumbnails', isCorrect: false }
          ],
          points: 10,
          order: 2
        },
        {
          quizId: quiz._id,
          questionText: 'Which WebRTC signaling mechanism coordinates peer connectivity between browsers?',
          options: [
            { text: 'SQL Query Joins', isCorrect: false },
            { text: 'SDP Offers, Answers, and ICE Candidate exchange via WebSockets', isCorrect: true },
            { text: 'Static HTML meta refresh tags', isCorrect: false },
            { text: 'CloudFront edge caching', isCorrect: false }
          ],
          points: 10,
          order: 3
        }
      ]);
    } else {
      quiz = storeAdapter.insertOne('quizzes', quizPayload);
      storeAdapter.insertMany('questions', [
        {
          quizId: quiz._id,
          questionText: 'What is the primary objective of the "Empathize" stage in design thinking?',
          options: [
            { text: 'To write product documentation and software unit tests', isCorrect: false },
            { text: 'To understand user needs, emotions, and pain points without assumptions', isCorrect: true },
            { text: 'To create high-fidelity UI components in Figma', isCorrect: false },
            { text: 'To set up AWS CloudFront distributions', isCorrect: false }
          ],
          points: 10,
          order: 1
        },
        {
          quizId: quiz._id,
          questionText: 'Why is FFmpeg faststart (-movflags +faststart) crucial for web video streaming?',
          options: [
            { text: 'It compresses audio into 8-bit mono channels', isCorrect: false },
            { text: 'It relocates the MP4 moov metadata atom to the beginning of the file for instant playback', isCorrect: true },
            { text: 'It disables video seeking during playback', isCorrect: false },
            { text: 'It generates vector thumbnails', isCorrect: false }
          ],
          points: 10,
          order: 2
        },
        {
          quizId: quiz._id,
          questionText: 'Which WebRTC signaling mechanism coordinates peer connectivity between browsers?',
          options: [
            { text: 'SQL Query Joins', isCorrect: false },
            { text: 'SDP Offers, Answers, and ICE Candidate exchange via WebSockets', isCorrect: true },
            { text: 'Static HTML meta refresh tags', isCorrect: false },
            { text: 'CloudFront edge caching', isCorrect: false }
          ],
          points: 10,
          order: 3
        }
      ]);
    }
  }

  // 3. Initial Student Enrolled Course & Completed Achievements (Diane Nguyen)
  if (firstCourseSaved) {
    const completedIds = firstCourseLessons.slice(0, 2).map(l => l._id.toString());
    const progress = Math.round((completedIds.length / firstCourseLessons.length) * 100);

    const enrollmentPayload = {
      studentId: savedStudent._id,
      courseId: firstCourseSaved._id,
      completedLessons: completedIds,
      progressPercentage: progress,
      enrolledAt: new Date(Date.now() - 7 * 86400000),
      isCompleted: false
    };

    if (isMongo) {
      await Enrollment.create(enrollmentPayload);
      await Certificate.create([
        {
          studentId: savedStudent._id,
          studentName: savedStudent.name,
          courseId: firstCourseSaved._id,
          courseTitle: 'Inorganic Chemistry Certificate',
          certificateNumber: 'NEX-CERT-2026-INORG',
          issuedDate: new Date(Date.now() - 30 * 86400000),
          grade: 'A+',
          scorePercentage: 96,
          instructorName: 'Prof. Linda Cruz',
          verificationUrl: 'http://localhost:5174/verify-certificate/NEX-CERT-2026-INORG'
        },
        {
          studentId: savedStudent._id,
          studentName: savedStudent.name,
          courseId: firstCourseSaved._id,
          courseTitle: 'Social Philosophy Certificate',
          certificateNumber: 'NEX-CERT-2026-SOCPHIL',
          issuedDate: new Date(Date.now() - 15 * 86400000),
          grade: 'A',
          scorePercentage: 92,
          instructorName: 'Prof. Jonathan Reyes',
          verificationUrl: 'http://localhost:5174/verify-certificate/NEX-CERT-2026-SOCPHIL'
        }
      ]);

      await LiveClass.create({
        title: 'Mastering Full-Stack Scalability & System Architecture',
        description: 'Live interactive masterclass on high-concurrency Node.js, WebRTC, and AWS CloudFront edge architectures.',
        courseId: firstCourseSaved._id,
        instructorId: savedInstructor._id,
        instructorName: savedInstructor.name,
        roomCode: 'nexvia-live-arch-room-1',
        scheduledStartTime: new Date(Date.now() + 3600000),
        scheduledEndTime: new Date(Date.now() + 7200000),
        durationMinutes: 60,
        status: LIVE_CLASS_STATUS.SCHEDULED,
        maxParticipants: 50,
        attendees: []
      });
    } else {
      storeAdapter.insertOne('enrollments', enrollmentPayload);
      storeAdapter.insertMany('certificates', [
        {
          studentId: savedStudent._id,
          studentName: savedStudent.name,
          courseId: firstCourseSaved._id,
          courseTitle: 'Inorganic Chemistry Certificate',
          certificateNumber: 'NEX-CERT-2026-INORG',
          issuedDate: new Date(Date.now() - 30 * 86400000),
          grade: 'A+',
          scorePercentage: 96,
          instructorName: 'Prof. Linda Cruz',
          verificationUrl: 'http://localhost:5174/verify-certificate/NEX-CERT-2026-INORG'
        },
        {
          studentId: savedStudent._id,
          studentName: savedStudent.name,
          courseId: firstCourseSaved._id,
          courseTitle: 'Social Philosophy Certificate',
          certificateNumber: 'NEX-CERT-2026-SOCPHIL',
          issuedDate: new Date(Date.now() - 15 * 86400000),
          grade: 'A',
          scorePercentage: 92,
          instructorName: 'Prof. Jonathan Reyes',
          verificationUrl: 'http://localhost:5174/verify-certificate/NEX-CERT-2026-SOCPHIL'
        }
      ]);

      storeAdapter.insertOne('liveClasses', {
        title: 'Mastering Full-Stack Scalability & System Architecture',
        description: 'Live interactive masterclass on high-concurrency Node.js, WebRTC, and AWS CloudFront edge architectures.',
        courseId: firstCourseSaved._id,
        instructorId: savedInstructor._id,
        instructorName: savedInstructor.name,
        roomCode: 'nexvia-live-arch-room-1',
        scheduledStartTime: new Date(Date.now() + 3600000),
        scheduledEndTime: new Date(Date.now() + 7200000),
        durationMinutes: 60,
        status: LIVE_CLASS_STATUS.SCHEDULED,
        maxParticipants: 50,
        attendees: []
      });
    }
  }

  console.log('[Seed] Database seeding completed successfully with 25 distinct video lessons!');
};

module.exports = seedDatabase;
