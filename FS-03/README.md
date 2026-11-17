# Project 2 – Learning Management System with Live Classes

## 1. Project Overview

Nexvia Learning Management System (LMS) is a full-stack educational web application developed as part of the Nexvia Technologies technical assessment.

The platform delivers an enterprise-grade online academy experience featuring role-based dashboards for students, instructors, and administrators, structured curriculum authoring, high-definition video lesson streaming, real-time peer-to-peer WebRTC live classrooms, interactive quizzes with automated grading, tamper-proof certificates of completion, and automated instructor revenue splitting.

## 2. Technology Stack

### Frontend
- React.js (React 19)
- Redux Toolkit (Centralized State Management)
- React Router DOM (v7)
- Tailwind CSS
- Lucide React (Icons)
- Canvas Confetti (Celebratory Quiz Animations)
- JavaScript (ES6+)
- HTML5 & CSS3

### Backend
- Node.js
- Express.js
- REST APIs
- Socket.io (Real-time WebRTC Signaling & Chat)
- JWT Authentication (JSON Web Tokens with RBAC)
- Multer (Video & Image Multipart Processing)

### Database
- MongoDB
- Mongoose ODM (Schemas, indexes, and resilient local persistent store fallback)

### Cloud and Integrations
- WebRTC (`RTCPeerConnection` with STUN/TURN servers for real-time video/audio & screen sharing)
- FFmpeg (`fluent-ffmpeg` for video metadata extraction, faststart web optimization, and thumbnail snapshots)
- BullMQ & Redis (Asynchronous background worker queues for video processing)
- AWS CloudFront (CDN media delivery with HTTP 206 Partial Content byte-range video streaming fallback)

Only technologies that are actually implemented in the project are listed.

## 3. Key Features

### Authentication
- User registration and login for Students, Instructors, and Platform Administrators
- JWT-based authentication with secure cookie and authorization header transmission
- Protected routes enforcing Role-Based Access Control (RBAC)
- Session persistence and automated token validation

### Course Management & Learning
- Curriculum authoring wizard with multi-stage module and lesson hierarchy
- Cinema video player with playback speed controls (0.75x to 2x), time scrubbing, and fullscreen mode
- Curriculum accordion with lesson completion checkmarks and progress tracking
- Synchronized lesson transcript notes with clickable timestamps
- Course catalog with category search, skill level filtering, and enrollment management

### Live Classes & WebRTC
- Real-time peer-to-peer WebRTC live video classrooms
- Two-way audio/video controls (camera toggle, microphone mute/unmute)
- Screen sharing capability for instructors and presenters
- Low-latency signaling powered by Socket.io and Google STUN servers
- Interactive in-room text chat during live classroom sessions

### Assessments and Certification
- Timed multiple-choice quizzes with automated evaluation and instant scoring
- Passing threshold validation with celebratory confetti animations
- Automated certificate generation upon curriculum and quiz completion
- Downloadable and printable Certificates of Completion with unique verification serial numbers (`NEX-CERT-XXXX`)
- Public certificate verification portal for employers and institutions

### Additional Features
- Instructor Studio: revenue metrics, enrolled students counter, course publishing workflow, and 85% instructor payout ledger
- Admin Command Center: course quality review and approval/rejection queue, platform GMV analytics, and user directory
- Responsive layout supporting desktop and mobile devices with dedicated slide-down navigation drawer

## 4. Application Architecture

```text
React + Redux Toolkit Frontend
      |
      | REST API + Socket.io (Signaling)
      |
Node.js + Express Backend
      |
      | Mongoose ODM
      |
MongoDB Database

External & Media Integrations:
- WebRTC (P2P Real-Time Video & Audio)
- Redis & BullMQ (Background Job Queue)
- FFmpeg (Video Transcoding & Optimization)
- AWS CloudFront (CDN Media Delivery)
```

## 5. Folder Structure

```text
FS-03/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   └── package.json
├── screenshots/
│   ├── 01_student_dashboard_ace_academy.jpg
│   ├── 02_course_player_mentora_academy.jpg
│   ├── 03_course_player_dronepilot.jpg
│   ├── 04_instructor_studio_mentori.jpg
│   └── 05_course_manager_fillo.jpg
├── .env.example
└── README.md
```

## 6. Environment Configuration

Create a `.env` file in the `backend/` directory using `.env.example` as a template:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nexvia_lms
JWT_SECRET=your_jwt_secret_key_here
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=nexvia-lms-media
AWS_CLOUDFRONT_DOMAIN=https://your-distribution.cloudfront.net
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5001/api
```

Refer to `.env.example` for the required configuration variables. Never commit actual credentials or API secrets.

## 7. Installation and Execution

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- MongoDB connection string or local MongoDB instance
- Redis (optional; in-memory fallback enabled for local evaluation)
- FFmpeg (optional; static binaries handled or fallback mock available)

### Backend

```bash
cd backend
npm install
npm run dev
```

Use the production start command defined in package.json when deploying:

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

## 8. Deployment

- **Frontend:** [https://nexvia-capstone-projects-hcv3.vercel.app](https://nexvia-capstone-projects-hcv3.vercel.app) *(Vercel)*
- **Backend:** [https://nexvia-capstone-projects.onrender.com](https://nexvia-capstone-projects.onrender.com) *(Render — Health Check: `/api/health`)*

### Test Accounts for Evaluation
- **Student:** `student@nexvia.com` / `password123`
- **Instructor:** `instructor@nexvia.com` / `password123`
- **Administrator:** `admin@nexvia.com` / `password123`

## 9. Screenshots

Screenshots demonstrating the actual application are located in `./screenshots/`:

- **Student Dashboard:** `./screenshots/01_student_dashboard_ace_academy.jpg`
- **Course Player & Lessons:** `./screenshots/02_course_player_mentora_academy.jpg`
- **Interactive Player & Notes:** `./screenshots/03_course_player_dronepilot.jpg`
- **Instructor Studio:** `./screenshots/04_instructor_studio_mentori.jpg`
- **Course Manager & Builder:** `./screenshots/05_course_manager_fillo.jpg`

## 10. Future Improvements

- Breakout rooms and collaborative interactive whiteboards during live classes
- Automated speech-to-text generating closed captions and AI lesson summaries
- SCORM 2004 / xAPI standard package export for external LMS interoperability
- Peer review assignments and discussion forums

## 11. Developer

**Vimal Pravin**

Developed for the Nexvia Technologies technical assessment.
