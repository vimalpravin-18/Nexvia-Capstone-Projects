const LiveClass = require('../models/LiveClass');
const Course = require('../models/Course');
const storeAdapter = require('../config/store');
const { getDBStatus } = require('../config/db');
const { LIVE_CLASS_STATUS, ROLES } = require('../config/constants');

// Helper to generate unique room code (e.g. 'NEX-842-K9P')
const generateRoomCode = () => {
  const p1 = Math.random().toString(36).substr(2, 3).toUpperCase();
  const p2 = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `NEX-${p1}-${p2}`;
};

// @desc    Get live classes (all or filtered by status)
// @route   GET /api/live-classes
// @access  Public / Authenticated
exports.getLiveClasses = async (req, res) => {
  try {
    const { status, courseId } = req.query;

    if (getDBStatus()) {
      let query = {};
      if (status) query.status = status;
      if (courseId) query.courseId = courseId;

      const classes = await LiveClass.find(query)
        .populate('courseId', 'title thumbnailUrl')
        .populate('instructorId', 'name avatar title')
        .sort({ scheduledStartTime: 1 });

      return res.json({ success: true, data: classes });
    } else {
      let classes = storeAdapter.find('liveClasses');
      if (status) classes = classes.filter(c => c.status === status);
      if (courseId) classes = classes.filter(c => c.courseId === courseId);

      const enriched = classes.map(c => {
        const course = c.courseId ? storeAdapter.findById('courses', c.courseId) : null;
        const instructor = storeAdapter.findById('users', c.instructorId);
        return {
          ...c,
          courseId: course,
          instructorId: instructor ? { name: instructor.name, avatar: instructor.avatar, title: instructor.title } : null
        };
      });

      enriched.sort((a, b) => new Date(a.scheduledStartTime) - new Date(b.scheduledStartTime));
      return res.json({ success: true, data: enriched });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create / Schedule a live class
// @route   POST /api/live-classes
// @access  Private (Instructor / Admin)
exports.createLiveClass = async (req, res) => {
  try {
    const { title, description, courseId, scheduledStartTime, scheduledEndTime, maxParticipants = 100 } = req.body;

    if (!title || !scheduledStartTime || !scheduledEndTime) {
      return res.status(400).json({ success: false, message: 'Title, start time, and end time are required.' });
    }

    const instructorId = (req.user._id || req.user.id).toString();
    const instructorName = req.user.name;
    const roomCode = generateRoomCode();

    const start = new Date(scheduledStartTime);
    const end = new Date(scheduledEndTime);
    const durationMinutes = Math.max(15, Math.round((end - start) / (1000 * 60)));

    if (getDBStatus()) {
      const liveClass = await LiveClass.create({
        title,
        description: description || '',
        courseId: courseId || null,
        instructorId,
        instructorName,
        scheduledStartTime: start,
        scheduledEndTime: end,
        durationMinutes,
        roomCode,
        status: LIVE_CLASS_STATUS.SCHEDULED,
        maxParticipants: Number(maxParticipants) || 100,
        attendees: []
      });

      return res.status(201).json({
        success: true,
        message: 'Live class scheduled successfully!',
        data: liveClass
      });
    } else {
      const liveClass = storeAdapter.insertOne('liveClasses', {
        title,
        description: description || '',
        courseId: courseId || null,
        instructorId,
        instructorName,
        scheduledStartTime: start.toISOString(),
        scheduledEndTime: end.toISOString(),
        durationMinutes,
        roomCode,
        status: LIVE_CLASS_STATUS.SCHEDULED,
        maxParticipants: Number(maxParticipants) || 100,
        attendees: []
      });

      return res.status(201).json({
        success: true,
        message: 'Live class scheduled successfully!',
        data: liveClass
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get live class details by room code
// @route   GET /api/live-classes/room/:roomCode
// @access  Private (Authenticated)
exports.getLiveClassByRoom = async (req, res) => {
  try {
    const { roomCode } = req.params;

    if (getDBStatus()) {
      const liveClass = await LiveClass.findOne({ roomCode })
        .populate('courseId', 'title thumbnailUrl')
        .populate('instructorId', 'name avatar title');

      if (!liveClass) {
        return res.status(404).json({ success: false, message: 'Live class session not found.' });
      }

      return res.json({ success: true, data: liveClass });
    } else {
      const liveClass = storeAdapter.findOne('liveClasses', { roomCode });
      if (!liveClass) {
        return res.status(404).json({ success: false, message: 'Live class session not found.' });
      }

      const course = liveClass.courseId ? storeAdapter.findById('courses', liveClass.courseId) : null;
      const instructor = storeAdapter.findById('users', liveClass.instructorId);

      return res.json({
        success: true,
        data: {
          ...liveClass,
          courseId: course,
          instructorId: instructor ? { name: instructor.name, avatar: instructor.avatar, title: instructor.title } : null
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update live class status (e.g. go live, end class)
// @route   PATCH /api/live-classes/:id/status
// @access  Private (Instructor / Admin)
exports.updateLiveClassStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(LIVE_CLASS_STATUS).includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    if (getDBStatus()) {
      const liveClass = await LiveClass.findByIdAndUpdate(id, { $set: { status } }, { new: true });
      if (!liveClass) {
        return res.status(404).json({ success: false, message: 'Live class not found.' });
      }
      return res.json({ success: true, message: `Class is now ${status}.`, data: liveClass });
    } else {
      const updated = storeAdapter.findByIdAndUpdate('liveClasses', id, { status });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Live class not found.' });
      }
      return res.json({ success: true, message: `Class is now ${status}.`, data: updated });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
