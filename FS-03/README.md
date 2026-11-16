# Nexvia Technologies — Capstone Project FS-03
# Learning Management System with Live Classes

> **Candidate:** Vimal Pravin ([@vimalpravin-18](https://github.com/vimalpravin-18))  
> **Assignment ID:** `FS-03`  
> **Specialization:** Full-Stack Development (MERN + WebRTC + FFmpeg + BullMQ + CloudFront + Redux Toolkit)  
> **Assessment Deadline:** 20 November 2026  
> **Project Status:** Complete, Fully Functional & Evaluator Ready  

---

## 📑 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Key Features](#2-key-features)
3. [Technology Stack](#3-technology-stack)
4. [Architecture Diagram](#4-architecture-diagram)
5. [Folder Structure](#5-folder-structure)
6. [Database Design](#6-database-design)
7. [API Documentation](#7-api-documentation)
8. [Environment Variable Configuration](#8-environment-variable-configuration)
9. [Installation & Setup Instructions](#9-installation--setup-instructions)
10. [Development Commands](#10-development-commands)
11. [Production Build Instructions](#11-production-build-instructions)
12. [Redis & BullMQ Background Job Processing](#12-redis--bullmq-background-job-processing)
13. [FFmpeg Video Processing & Media Optimization](#13-ffmpeg-video-processing--media-optimization)
14. [WebRTC Real-Time Live Classroom & Signaling](#14-webrtc-real-time-live-classroom--signaling)
15. [AWS CloudFront & S3 Media Delivery Setup](#15-aws-cloudfront--s3-media-delivery-setup)
16. [Automated Testing & Verification](#16-automated-testing--verification)
17. [Evaluation Test Accounts](#17-evaluation-test-accounts)
18. [Screenshots & UI Walkthrough](#18-screenshots--ui-walkthrough)
19. [Deployment Instructions](#19-deployment-instructions)
20. [Known Limitations & Future Scope](#20-known-limitations--future-scope)

---

## 1. Project Overview
**Nexvia LMS** is an enterprise-grade online school platform engineered for modern education academies. It provides end-to-end support for structured curriculum authoring, high-definition video lesson streaming, real-time peer-to-peer WebRTC live classrooms, interactive quizzes with auto-grading, automated tamper-proof certificates of completion, and automated instructor revenue splitting.

The application follows the mandatory MERN stack with strict architectural isolation from `FS-01` (Multi-Vendor Marketplace) in the master portfolio.

---

## 2. Key Features

### 🎓 A. Student Experience (Inspired by Ace Academy, Mentora & DronePilot)
- **Interactive Student Dashboard:** Welcome hero card with weekly goal completion meter, enrolled courses with progress bars, verified achievement cards with gold/purple ribbon badges, and an interactive schedule calendar.
- **Cinema Video Player:** 16:9 responsive HD video player with custom controls, time scrubbing, playback speed adjustment (0.75x to 2x), and fullscreen toggle.
- **Curriculum Navigation:** Multi-stage accordion with lesson status indicators (completed checkmark, active pulsing spinner, locked padlock), transcript notes with timestamps, and lesson completion tracking.
- **Interactive Quizzes:** Timed multiple-choice evaluations with automated scoring, passing thresholds, instant results, and celebratory confetti animations upon passing.
- **Official Certificates:** Downloadable and printable Certificates of Completion with unique verification serial numbers (`NEX-CERT-XXXX`).
- **Live Class Participation:** One-click entry into WebRTC video classrooms with camera/mic controls, hand-raising, screen view, and in-room chat.

### 👩‍🏫 B. Instructor Studio (Inspired by Mentori & Fillo)
- **Instructor Command Center:** Real-time metrics for total revenue, enrolled students, authored courses, and average star ratings.
- **Course Creation Wizard:** Comprehensive course builder with category tagging, pricing/discount setup, thumbnail uploads, and multi-stage curriculum organization.
- **Video Management:** Secure video upload engine backed by automated FFmpeg metadata extraction, faststart web optimization, and snapshot thumbnail generation.
- **Live Classroom Scheduling:** Schedule live webinars and broadcast sessions with room codes and start/end time duration calculators.
- **Earnings & Revenue:** Automated 85% instructor payout ledger on course enrollments with real-time gross revenue tracking.

### 🛡️ C. Admin Command Center
- **Academic Governance:** Platform overview of gross merchandise value (GMV), 15% platform commission fees, active live classrooms, and user counts.
- **Course Quality Assurance Queue:** Inspect draft/submitted courses; one-click Approve & Publish or Reject with feedback.
- **User RBAC Directory:** Manage student and instructor accounts with role status tracking.

---

## 3. Technology Stack

| Layer | Technologies Used | Justification |
|---|---|---|
| **Frontend** | React 19, Redux Toolkit, React Router v7, Lucide Icons, Canvas Confetti | Centralized state management, smooth reactive UI, modern component tree matching reference designs. |
| **Backend** | Node.js, Express.js | High-throughput asynchronous REST API engine with modular routing and unified error handling. |
| **Database** | MongoDB & Mongoose | Document database with relational references, indexes, and resilient local persistent store fallback. |
| **Live Classroom** | WebRTC (`RTCPeerConnection`) + `socket.io` | Ultra-low latency audio/video streaming, SDP signaling, ICE candidate relay, and room controls. |
| **Video Engine** | FFmpeg (`fluent-ffmpeg` + static installer binaries) | Transcoding, `-movflags +faststart` MP4 optimization, duration/resolution metadata probing, and thumbnail snapshots. |
| **Job Queue** | BullMQ + Redis (`ioredis`) | Asynchronous background workers for video processing, thumbnails, and heavy processing jobs with in-process fallback. |
| **Media CDN** | AWS CloudFront + HTTP 206 Partial Content | CloudFront distribution routing with local byte-range video streaming fallback for seamless video seeking. |

---

## 4. Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│               FRONTEND CLIENT (React 19 + Redux Toolkit + Tailwind CSS) │
│                                                                        │
│   [Student Dashboard]       [Instructor Studio]      [Admin Center]   │
│   - Course Player & Notes   - Course & Video Studio  - Approvals/RBAC  │
│   - Quizzes & Certificates  - Live Class Studio      - Platform Logs   │
│   - Calendar & Schedule     - Earnings & Analytics   - Live Monitor    │
└──────────────────┬─────────────────────────────┬───────────────────────┘
                   │ HTTPS REST API              │ WebRTC Signaling (WS)
                   ▼                             ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  BACKEND ENGINE (Node.js + Express.js)                  │
│                                                                        │
│   ├── JWT RBAC & Middleware      ├── Socket.io Signaling Server        │
│   ├── Course & Lesson Service    ├── Live Classroom Sessions           │
│   ├── Enrollment & Progress      ├── Quiz & Grading Engine             │
│   ├── Instructor Earnings Ledger └── CloudFront / Local Media Adapter  │
└──────────────────┬─────────────────────────────┬───────────────────────┘
                   │                             │
                   ▼                             ▼
┌───────────────────────────────────┐ ┌──────────────────────────────────┐
│      PERSISTENCE LAYER (MongoDB)  │ │      BACKGROUND WORKERS (BullMQ) │
│                                   │ │                                  │
│  - Users & Profiles               │ │  - Video Transcoding (FFmpeg)    │
│  - Courses, Sections & Lessons    │ │  - Automated Thumbnail Gen       │
│  - Enrollments & Progress         │ │  - Video Metadata Extraction     │
│  - Quizzes, Attempts & Certs      │ │  - Certificate PDF Generation    │
│  - Earnings & LiveClass Sessions  │ │  (Backed by Redis / Resilient Q) │
└───────────────────────────────────┘ └──────────────────────────────────┘
```

---

## 5. Folder Structure

```text
FS-03/
├── frontend/                         # Client Single Page Application
│   ├── src/
│   │   ├── app/                      # Redux Toolkit store configuration
│   │   │   └── store.js
│   │   ├── components/               # Reusable UI Components
│   │   │   ├── common/               # Navbar, Sidebar, Modals
│   │   │   ├── course/               # CourseCard, VideoPlayer, CurriculumAccordion
│   │   │   ├── live/                 # WebRTCClassroom, VideoGrid, Chat
│   │   │   └── certificate/          # CertificateModal
│   │   ├── features/                 # Redux Slices
│   │   │   ├── auth/                 # authSlice.js
│   │   │   ├── courses/              # courseSlice.js
│   │   │   ├── enrollments/          # enrollmentSlice.js
│   │   │   └── liveClass/            # liveClassSlice.js
│   │   ├── pages/                    # Role-Based Page Views
│   │   │   ├── student/              # Dashboard, Catalog, Player, Quiz, Certificates
│   │   │   ├── instructor/           # Studio Dashboard, CourseBuilder
│   │   │   ├── admin/                # Platform Governance Dashboard
│   │   │   └── public/               # Login, Register, Verify Certificate
│   │   ├── services/                 # api.js & socketService.js
│   │   ├── styles/                   # index.css design tokens
│   │   ├── App.jsx                   # React Router v7 routes
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js                # Port 5174 (prevents collision with FS-01 on 5173)
│
├── backend/                          # REST API & Real-Time Engine
│   ├── src/
│   │   ├── config/                   # Constants, db.js, redis.js, store.js
│   │   ├── controllers/              # Auth, Course, Enrollment, LiveClass, Quiz, Media, Admin
│   │   ├── middleware/               # JWT auth & RBAC, Multer upload, ErrorHandler
│   │   ├── models/                   # 15 Mongoose schemas
│   │   ├── routes/                   # Modular Express routers
│   │   ├── services/                 # ffmpegService.js, bullQueueService.js, cloudFrontService.js
│   │   ├── sockets/                  # liveClassSocket.js (WebRTC signaling)
│   │   ├── data/                     # seedData.js (realistic initial courses & accounts)
│   │   ├── tests/                    # auth_and_courses.test.js (15 integration test suites)
│   │   ├── app.js
│   │   └── server.js                 # Port 5001 (prevents collision with FS-01 on 5000)
│   ├── .env.example
│   └── package.json
│
├── screenshots/                      # Visual reference mockups
├── .env.example                      # Root configuration template
└── README.md                         # Technical documentation (This Document)
```

---

## 6. Database Design

The data model is structured across 15 normalized MongoDB collections:
- **`User`**: ID, name, email, passwordHash, role (`student` | `instructor` | `admin`), avatar, title, bio, isActive.
- **`StudentProfile`**: userId, enrolledCoursesCount, completedCoursesCount, certificatesEarned, weeklyGoalPercentage.
- **`InstructorProfile`**: userId, headline, biography, expertise, totalStudents, totalCourses, totalRevenue, rating.
- **`Course`**: title, slug, subtitle, description, category, level, price, discountPrice, thumbnailUrl, instructorId, status, duration, totalLessons, rating, requirements, whatYouWillLearn.
- **`Section`**: courseId, title, order.
- **`Lesson`**: sectionId, courseId, title, type (`video` | `reading`), videoUrl, cloudFrontUrl, durationFormatted, thumbnailUrl, order, transcriptNotes.
- **`Enrollment`**: studentId, courseId, completedLessons, progressPercentage, lastAccessedLessonId, status, completedAt.
- **`LiveClass`**: title, description, courseId, instructorId, scheduledStartTime, scheduledEndTime, durationMinutes, roomCode, status, maxParticipants, attendees.
- **`Quiz`**: courseId, title, description, passingScorePercentage, timeLimitMinutes, totalQuestions.
- **`Question`**: quizId, questionText, options (`[{ text, isCorrect }]`), points, order.
- **`QuizAttempt`**: quizId, studentId, courseId, answers, score, percentage, passed, timeSpentSeconds.
- **`Certificate`**: certificateNumber, studentId, studentName, courseId, courseTitle, instructorName, issuedDate, verificationUrl, badgeColor.
- **`Earnings`**: instructorId, courseId, courseTitle, studentId, grossAmount, platformFee (15%), netInstructorAmount (85%), status.
- **`MediaAsset`**: originalFilename, storagePath, mimeType, fileSize, cloudFrontUrl, durationSeconds, resolution, thumbnailUrl, processingStatus, jobId.
- **`Notification`**: userId, title, message, type, link, isRead.

---

## 7. API Documentation

### Authentication & Profiles (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new Student or Instructor |
| `POST` | `/api/auth/login` | Public | Login with email/password; returns JWT |
| `GET` | `/api/auth/me` | Private | Get current authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user avatar, title, or bio |

### Course Catalog & Curriculum (`/api/courses`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/courses` | Public | List published courses with category, search, sorting |
| `GET` | `/api/courses/:id` | Public | Get course details with full sections & lessons |
| `GET` | `/api/courses/instructor/my-courses` | Instructor | List courses authored by authenticated instructor |
| `POST` | `/api/courses` | Instructor | Create a new course |
| `PUT` | `/api/courses/:id` | Instructor | Update course metadata |
| `POST` | `/api/courses/:id/sections` | Instructor | Add curriculum section |
| `POST` | `/api/courses/:id/sections/:sectionId/lessons` | Instructor | Add video lesson to section |

### Enrollments & Learning Progress (`/api/enrollments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/enrollments/enroll/:courseId` | Student | Enroll in course & calculate instructor earnings |
| `GET` | `/api/enrollments/my-courses` | Student | Get all courses enrolled by authenticated student |
| `POST` | `/api/enrollments/:courseId/lessons/:lessonId/complete` | Student | Mark lesson complete; auto-issues cert at 100% |

### Live Classroom & WebRTC (`/api/live-classes`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/live-classes` | Public | List scheduled and ongoing live broadcasts |
| `POST` | `/api/live-classes` | Instructor | Schedule new live classroom session |
| `GET` | `/api/live-classes/room/:roomCode` | Private | Fetch session metadata by room code |
| `PATCH`| `/api/live-classes/:id/status` | Instructor | Transition session (`scheduled` -> `live` -> `completed`) |

### Quizzes & Assessments (`/api/quizzes`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/quizzes/course/:courseId` | Private | Fetch quiz questions (answers stripped for students) |
| `POST` | `/api/quizzes/:quizId/submit` | Student | Submit answers; automated grading and score evaluation |

### Certificates (`/api/certificates`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/certificates/my-certificates` | Student | List certificates earned by student |
| `GET` | `/api/certificates/verify/:certNumber` | Public | Public validity & authenticity verification |

### Media & Video Streaming (`/api/media`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/media/upload-video` | Instructor | Upload video file & enqueue BullMQ FFmpeg processing |
| `POST` | `/api/media/upload-thumbnail` | Instructor | Upload course thumbnail image |
| `GET` | `/api/media/stream/:filename` | Public | HTTP 206 Partial Content byte-range video streaming |
| `GET` | `/api/media/status/:id` | Private | Get background video processing status |

### Platform Admin (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/analytics` | Admin | Aggregate GMV, commissions, courses, and user stats |
| `GET` | `/api/admin/courses/pending` | Admin | List courses awaiting verification |
| `PATCH`| `/api/admin/courses/:id/status`| Admin | Approve & publish or reject course |
| `GET` | `/api/admin/users` | Admin | User governance directory |

---

## 8. Environment Variable Configuration
The backend reads from `backend/.env`. A safe template is provided in `backend/.env.example` and `FS-03/.env.example`:

```env
# Server Port (5001 avoids conflict with FS-01 on 5000)
PORT=5001

# Security & Authentication
JWT_SECRET=nexvia_lms_super_secret_jwt_key_2026_enterprise

# Database Connection (MongoDB Atlas)
# Leave commented out to run zero-config resilient local JSON store
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/nexvia_lms

# Background Queue & Caching (BullMQ)
REDIS_URL=redis://127.0.0.1:6379

# AWS S3 & CloudFront Media CDN Configuration
AWS_REGION=ap-southeast-2
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_S3_BUCKET=nexvia-lms-media
# CLOUDFRONT_DOMAIN=d123456abcdef.cloudfront.net
```

---

## 9. Installation & Setup Instructions

### Prerequisites
- Node.js v18+ (tested on Node v24.19.0)
- npm v9+

### Quickstart (2 Steps)

1. **Setup & Start Backend Engine (`FS-03/backend`):**
   ```bash
   cd FS-03/backend
   npm install
   npm start
   ```
   *The backend starts at `http://localhost:5001`. Health Check: `http://localhost:5001/api/health`.*

2. **Setup & Start Frontend Application (`FS-03/frontend`):**
   ```bash
   cd FS-03/frontend
   npm install
   npm run dev
   ```
   *The frontend starts at `http://localhost:5174` with automatic Vite proxying to the backend.*

---

## 10. Development Commands

| Service | Command | Action |
|---|---|---|
| **Backend** | `npm run dev` | Starts server with Nodemon auto-reload on port 5001 |
| **Backend** | `npm test` | Executes the 15-suite integration verification test |
| **Frontend**| `npm run dev` | Starts Vite HMR development server on port 5174 |
| **Frontend**| `npm run build` | Compiles production assets into `frontend/dist/` |

---

## 11. Production Build Instructions
```bash
cd FS-03/frontend
npm run build
```
Outputs optimized static assets to `FS-03/frontend/dist`. Can be served directly via Vercel, Netlify, or Express static middleware.

---

## 12. Redis & BullMQ Background Job Processing
BullMQ manages asynchronous time-intensive tasks:
- Video transcoding and `-movflags +faststart` metadata alignment.
- Snapshot thumbnail extraction at 2-second and 5-second marks.
- Resolution probing and duration calculations.
- Resilient In-Process Queue Fallback: If Redis is offline during evaluation, the backend automatically falls back to an in-process asynchronous runner so job execution never halts!

---

## 13. FFmpeg Video Processing & Media Optimization
- Integrated via `fluent-ffmpeg` paired with `@ffmpeg-installer/ffmpeg` and `@ffprobe-installer/ffprobe`.
- Bundles cross-platform static binaries directly into `node_modules` — runs out of the box on Windows, macOS, and Linux without requiring manual OS PATH configurations.
- Video scrubbing is powered by an HTTP 206 Partial Content byte-range streaming server (`/api/media/stream/:filename`).

---

## 14. WebRTC Real-Time Live Classroom & Signaling
- Real-time peer-to-peer audio and video via native browser `RTCPeerConnection`.
- Signaling relayed through Express and Socket.io (`join-room`, `offer`, `answer`, `ice-candidate`, `media-state-change`, `raise-hand`, `send-message`).
- Includes public Google STUN servers:
  ```javascript
  {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  }
  ```
- Handles device permissions, microphone muting, video toggling, screen sharing stream replacement, active attendee lists, and participant disconnections.

---

## 15. AWS CloudFront & S3 Media Delivery Setup
- Abstracted `cloudFrontService.js` detects `CLOUDFRONT_DOMAIN` from environment variables.
- When configured, media URLs resolve to `https://${CLOUDFRONT_DOMAIN}/${key}`.
- When omitted during local testing, media is seamlessly delivered via the backend's HTTP 206 streaming endpoint with zero exposed credentials.

---

## 16. Automated Testing & Verification
The backend includes an automated test suite verifying all major capabilities:
```bash
cd FS-03/backend
npm test
```

### Test Results
```text
========================================================
🧪 Starting Nexvia LMS [FS-03] Integration Verification
========================================================

  ✅ PASS: Health check returns 200 OK
  ✅ PASS: Student authentication successful
  ✅ PASS: Instructor authentication successful
  ✅ PASS: Admin authentication successful
  ✅ PASS: RBAC prevents student from creating courses (HTTP 403)
  ✅ PASS: Course catalog returned 4 courses
  ✅ PASS: Course details returned full curriculum with sections and lessons
  ✅ PASS: Student fetched enrolled courses
  ✅ PASS: Live classes returned 2 scheduled/live classes
  ✅ PASS: Live classroom lookup by room code verified
  ✅ PASS: Quiz loaded with sanitized questions (answers hidden)
  ✅ PASS: Quiz evaluation calculated score and pass/fail status
  ✅ PASS: Certificate verified with student name & serial number
  ✅ PASS: Admin analytics successfully aggregated platform metrics
  ✅ PASS: FFmpeg Service loaded and initialized

========================================================
📊 Test Summary: 15 Passed, 0 Failed
========================================================
```

---

## 17. Evaluation Test Accounts

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Student** | `student@nexvia.com` | `password123` | Student Dashboard, Video Lessons, Enrolled Courses, Quizzes, Certificates, Live Classroom |
| **Instructor**| `instructor@nexvia.com` | `password123` | Instructor Studio, Course Builder, Video Uploader, Schedule Live Classes, Earnings |
| **Administrator**| `admin@nexvia.com` | `password123` | Platform Command Center, Course Approval/Rejection Queue, User Directory |

*(One-click demo buttons are available on the `/login` page for instant evaluation).*

---

## 18. Screenshots & UI Walkthrough
Visual assets matching the reference designs are stored in `FS-03/screenshots/`:
- `01_student_dashboard_ace_academy.jpg` — Student Dashboard (Ace Academy style).
- `02_course_player_mentora_academy.jpg` — Cinema Video Classroom (Mentora style).
- `03_course_player_dronepilot.jpg` — Course Player & Quiz CTA (DronePilot style).
- `04_instructor_studio_mentori.jpg` — Instructor Courses Studio (Mentori style).
- `05_course_manager_fillo.jpg` — Course Manager Grid & Filters (Fillo style).

---

## 19. Deployment Instructions

### Vercel Deployment (Frontend)
1. Set Root Directory: `FS-03/frontend`
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set Environment Variable: `VITE_API_URL` to your production backend URL.

### Render / Railway Deployment (Backend)
1. Set Root Directory: `FS-03/backend`
2. Build Command: `npm install`
3. Start Command: `node src/server.js`
4. Health Check Path: `/api/health`

---

## 20. Known Limitations & Future Scope
1. **Mesh WebRTC:** The current WebRTC implementation uses a full mesh topology suitable for up to 10-15 simultaneous active video feeds. For large-scale webinars with 100+ cameras, an SFU (Selective Forwarding Unit like mediasoup or LiveKit) can be integrated.
2. **CloudFront Signed Cookies:** CloudFront signed cookies can be activated for enterprise private video distribution by providing RSA keypair environment variables.

---

## 📄 License & Attribution
Developed for **Nexvia Technologies** Full-Stack Technical Evaluation.  
Author: **Vimal Pravin** ([@vimalpravin-18](https://github.com/vimalpravin-18))
