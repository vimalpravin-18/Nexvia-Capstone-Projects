const express = require('express');
const router = express.Router();
const {
  getLiveClasses,
  createLiveClass,
  getLiveClassByRoom,
  updateLiveClassStatus
} = require('../controllers/liveClassController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

// All live class endpoints require authentication
router.get('/', protect, getLiveClasses);
router.get('/room/:roomCode', protect, getLiveClassByRoom);
router.post('/', protect, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), createLiveClass);
router.patch('/:id/status', protect, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), updateLiveClassStatus);

module.exports = router;
