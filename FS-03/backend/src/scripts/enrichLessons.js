const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../../data/lms_store.json');

if (!fs.existsSync(storePath)) {
  console.error('Store file not found at:', storePath);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(storePath, 'utf8'));

// Sample Video CDN URLs
const VIDEOS = {
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

const courses = data.courses || [];
console.log(`Found ${courses.length} courses to enrich.`);

// Clear old sections and lessons
data.sections = [];
data.lessons = [];

const genId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;

// Define rich curriculums
const curriculums = {
  0: { // Design Thinking Fundamentals
    sections: [
      {
        title: 'Stage 1: Introduction to Design Thinking',
        lessons: [
          {
            title: 'Introduction to Design Thinking',
            videoUrl: VIDEOS.BIG_BUCK,
            durationMinutes: 7,
            durationFormatted: '06:47',
            description: 'This class is designed to help you master the essentials of design thinking through real-world case studies.',
            transcriptNotes: [
              { timestamp: '01:10', text: 'Design thinking is a human-centered approach to problem solving.' },
              { timestamp: '03:45', text: 'The 5 stages: Empathize, Define, Ideate, Prototype, and Test.' },
              { timestamp: '05:30', text: 'Setting up user discovery interviews.' }
            ]
          },
          {
            title: 'Empathize with Users & Research Methodologies',
            videoUrl: VIDEOS.ELEPHANTS,
            durationMinutes: 22,
            durationFormatted: '22:40',
            description: 'Learn how to observe, engage, and empathize with users to understand their experiences and motivations.',
            transcriptNotes: [
              { timestamp: '04:20', text: 'Conducting non-leading interviews.' },
              { timestamp: '12:15', text: 'Mapping customer journey emotion states.' },
              { timestamp: '18:50', text: 'Synthesizing observational field notes.' }
            ]
          },
          {
            title: 'Define the Core Problem Statement',
            videoUrl: VIDEOS.BLAZES,
            durationMinutes: 35,
            durationFormatted: '35:18',
            description: 'Structure your insights into an actionable Point of View (POV) and generate How Might We (HMW) questions.',
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
            videoUrl: VIDEOS.FUN,
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
            videoUrl: VIDEOS.JOY,
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
            videoUrl: VIDEOS.ESCAPES,
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
  1: { // Drone Flight Basics
    sections: [
      {
        title: 'Stage 1: Drone Aerodynamics & Flight Physics',
        lessons: [
          {
            title: 'Introduction to Drone Aerodynamics',
            videoUrl: VIDEOS.TEARS,
            durationMinutes: 12,
            durationFormatted: '12:30',
            description: 'Learn the essential aerodynamic principles of stable flight, thrust-to-weight ratios, and safe drone control.',
            transcriptNotes: [
              { timestamp: '01:30', text: 'Four forces of flight: Lift, Weight, Thrust, and Drag.' },
              { timestamp: '07:15', text: 'Quadcopter yaw, pitch, and roll dynamics.' }
            ]
          },
          {
            title: 'Propeller Aerodynamics & Blade Pitch',
            videoUrl: VIDEOS.MELTDOWNS,
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
            videoUrl: VIDEOS.SUBARU,
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
            videoUrl: VIDEOS.BULLRUN,
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
            videoUrl: VIDEOS.CAR_GRAND,
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
            videoUrl: VIDEOS.SINTEL,
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
            videoUrl: VIDEOS.JOY,
            durationMinutes: 23,
            durationFormatted: '23:10',
            description: 'PID loops, gyro filtering (RPM filters), and flight stabilization algorithms in Betaflight.',
            transcriptNotes: [
              { timestamp: '05:30', text: 'Configuring notch and lowpass filters.' }
            ]
          },
          {
            title: 'GPS, Barometer and Failsafe Return-to-Home',
            videoUrl: VIDEOS.ESCAPES,
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
  2: { // UI/UX Design Level Up with Prototyping
    sections: [
      {
        title: 'Stage 1: Design Systems & Architecture',
        lessons: [
          {
            title: 'Design Tokens, Color Palettes & Type Scales',
            videoUrl: VIDEOS.FUN,
            durationMinutes: 18,
            durationFormatted: '18:25',
            description: 'Constructing robust semantic design tokens for light/dark mode and enterprise multi-brand systems.',
            transcriptNotes: [
              { timestamp: '04:15', text: 'Semantic tokens vs raw primitive values.' }
            ]
          },
          {
            title: 'Atomic Components & Figma Auto-Layout v5',
            videoUrl: VIDEOS.BIG_BUCK,
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
            videoUrl: VIDEOS.ELEPHANTS,
            durationMinutes: 32,
            durationFormatted: '32:15',
            description: 'Creating realistic micro-interactions, spring physics, and animated transitions in Figma.',
            transcriptNotes: [
              { timestamp: '08:00', text: 'Spring easing curves for natural touch feedback.' }
            ]
          },
          {
            title: 'Usability Heuristics & Conversion Testing',
            videoUrl: VIDEOS.BLAZES,
            durationMinutes: 26,
            durationFormatted: '25:50',
            description: 'Applying Nielsen Norman 10 heuristics to eliminate friction in SaaS checkout and onboarding funnels.',
            transcriptNotes: [
              { timestamp: '07:20', text: 'Error prevention vs error recovery mechanisms.' }
            ]
          },
          {
            title: 'Developer Handoff & Design Systems Governance',
            videoUrl: VIDEOS.TEARS,
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
  3: { // Full Stack JavaScript & Cloud Development
    sections: [
      {
        title: 'Stage 1: Express REST & Real-time WebRTC',
        lessons: [
          {
            title: 'Full-Stack Architecture & Express REST APIs',
            videoUrl: VIDEOS.CAR_GRAND,
            durationMinutes: 27,
            durationFormatted: '27:15',
            description: 'Structuring clean MVC Express applications with centralized error handling, Joi validation, and JWT authentication.',
            transcriptNotes: [
              { timestamp: '06:10', text: 'Express middleware chains and secure route guards.' }
            ]
          },
          {
            title: 'MongoDB Schema Modeling & Aggregation Pipelines',
            videoUrl: VIDEOS.BULLRUN,
            durationMinutes: 35,
            durationFormatted: '34:40',
            description: 'Indexing strategies, schema validation, relationship modeling, and aggregation stages for analytics.',
            transcriptNotes: [
              { timestamp: '12:40', text: 'Compound indexes for fast queries.' }
            ]
          },
          {
            title: 'WebRTC Peer Connections & Video Signaling Sockets',
            videoUrl: VIDEOS.SUBARU,
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
            videoUrl: VIDEOS.MELTDOWNS,
            durationMinutes: 30,
            durationFormatted: '29:30',
            description: 'Implementing fluent-ffmpeg pipelines, generating video thumbnails, and faststart MP4 optimization.',
            transcriptNotes: [
              { timestamp: '08:20', text: 'MP4 moov atom placement and HLS master playlists.' }
            ]
          },
          {
            title: 'AWS S3 & CloudFront Edge CDN Delivery',
            videoUrl: VIDEOS.SINTEL,
            durationMinutes: 31,
            durationFormatted: '31:15',
            description: 'Configuring Amazon CloudFront distributions, cache policies, signed cookies, and origin access control.',
            transcriptNotes: [
              { timestamp: '11:15', text: 'CloudFront OAC security and edge caching.' }
            ]
          },
          {
            title: 'BullMQ Background Queues with Redis',
            videoUrl: VIDEOS.JOY,
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
};

// Populate sections & lessons
courses.forEach((course, cIdx) => {
  const cData = curriculums[cIdx] || curriculums[0];
  
  cData.sections.forEach((secDef, sIdx) => {
    const secId = genId('sec');
    const sectionRecord = {
      _id: secId,
      courseId: course._id,
      title: secDef.title,
      order: sIdx + 1
    };
    data.sections.push(sectionRecord);

    secDef.lessons.forEach((lesDef, lIdx) => {
      const lesId = genId('les');
      const lessonRecord = {
        _id: lesId,
        courseId: course._id,
        sectionId: secId,
        title: lesDef.title,
        type: 'video',
        videoUrl: lesDef.videoUrl,
        durationMinutes: lesDef.durationMinutes,
        durationFormatted: lesDef.durationFormatted,
        order: lIdx + 1,
        isFreePreview: lIdx === 0,
        description: lesDef.description,
        transcriptNotes: lesDef.transcriptNotes || [
          { timestamp: '01:00', text: 'Key overview of foundational concepts.' },
          { timestamp: '05:30', text: 'Implementation techniques and best practices.' }
        ]
      };
      data.lessons.push(lessonRecord);
    });
  });
});

// Update enrollments with completed lessons matching new ids
if (data.enrollments && data.enrollments.length > 0) {
  const firstCourseLessons = data.lessons.filter(l => l.courseId === courses[0]._id);
  if (firstCourseLessons.length >= 2) {
    data.enrollments[0].completedLessons = [
      firstCourseLessons[0]._id,
      firstCourseLessons[1]._id
    ];
    data.enrollments[0].progressPercentage = Math.round((2 / firstCourseLessons.length) * 100);
  }
}

fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Successfully enriched store with ${data.sections.length} sections and ${data.lessons.length} distinct lessons!`);
