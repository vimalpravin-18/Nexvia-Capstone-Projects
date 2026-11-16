/**
 * HTTP & WebSocket Server Entry Point
 */
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { connectDB, getDBStatus } = require('./config/db');
const { initRedis } = require('./config/redis');
const { initBullMQ } = require('./services/bullQueueService');
const setupLiveClassSocket = require('./sockets/liveClassSocket');
const storeAdapter = require('./config/store');
const seedDatabase = require('./data/seedData');

// Models for seed data
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const InstructorProfile = require('./models/InstructorProfile');
const Course = require('./models/Course');
const Section = require('./models/Section');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const LiveClass = require('./models/LiveClass');
const Certificate = require('./models/Certificate');
const Enrollment = require('./models/Enrollment');

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

// Socket.io for Real-Time Live Class WebRTC Signaling
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Setup Live Classroom signaling handlers
setupLiveClassSocket(io);

// Server Startup Routine
const startServer = async () => {
  try {
    // 1. Connect to Database (MongoDB Atlas / local resilient store fallback)
    await connectDB();

    // 2. Initialize Redis & BullMQ
    initRedis();
    initBullMQ();

    // 3. Seed initial records if empty
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
      getDBStatus
    );

    // 4. Start HTTP Server
    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Nexvia LMS API Engine [FS-03] Online`);
      console.log(`📡 Server Address: http://localhost:${PORT}`);
      console.log(`🩺 Health Check:   http://localhost:${PORT}/api/health`);
      console.log(`⚡ WebRTC Sockets: Ready for live classrooms`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Fatal Server Startup Error:', err);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server, io };
