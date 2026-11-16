const Course = require('../models/Course');
const Section = require('../models/Section');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const storeAdapter = require('../config/store');
const { getDBStatus } = require('../config/db');
const { COURSE_STATUS, ROLES } = require('../config/constants');

// Helper to create slug from title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// @desc    Get all published courses with search, filters, pagination
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const { category, level, search, sort = 'newest', page = 1, limit = 12 } = req.query;

    if (getDBStatus()) {
      let query = { status: COURSE_STATUS.PUBLISHED };

      if (category && category !== 'All' && category !== 'All Category') {
        query.category = category;
      }

      if (level && level !== 'All Levels') {
        query.level = level;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'popular') sortOption = { enrollmentCount: -1 };
      if (sort === 'rating') sortOption = { rating: -1 };
      if (sort === 'price_asc') sortOption = { price: 1 };
      if (sort === 'price_desc') sortOption = { price: -1 };

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Course.countDocuments(query);
      const courses = await Course.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate('instructorId', 'name avatar title');

      return res.json({
        success: true,
        data: {
          courses,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    } else {
      let courses = storeAdapter.find('courses', { status: COURSE_STATUS.PUBLISHED });

      if (category && category !== 'All' && category !== 'All Category') {
        courses = courses.filter(c => c.category === category);
      }

      if (level && level !== 'All Levels') {
        courses = courses.filter(c => c.level === level);
      }

      if (search) {
        const q = search.toLowerCase();
        courses = courses.filter(c => 
          (c.title && c.title.toLowerCase().includes(q)) || 
          (c.description && c.description.toLowerCase().includes(q))
        );
      }

      if (sort === 'popular') courses.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
      else if (sort === 'rating') courses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      else if (sort === 'price_asc') courses.sort((a, b) => (a.price || 0) - (b.price || 0));
      else if (sort === 'price_desc') courses.sort((a, b) => (b.price || 0) - (a.price || 0));
      else courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const total = courses.length;
      const skip = (Number(page) - 1) * Number(limit);
      const paginated = courses.slice(skip, skip + Number(limit));

      return res.json({
        success: true,
        data: {
          courses: paginated,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)) || 1
          }
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single course with curriculum (sections & lessons)
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      let course = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        course = await Course.findById(id).populate('instructorId', 'name avatar title bio');
      }
      if (!course) {
        course = await Course.findOne({ slug: id }).populate('instructorId', 'name avatar title bio');
      }

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      const sections = await Section.find({ courseId: course._id }).sort({ order: 1 });
      const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 });

      const curriculum = sections.map(sec => {
        const sectionLessons = lessons.filter(les => les.sectionId.toString() === sec._id.toString());
        return {
          ...sec.toObject(),
          lessons: sectionLessons
        };
      });

      return res.json({
        success: true,
        data: {
          course,
          curriculum
        }
      });
    } else {
      let course = storeAdapter.findById('courses', id);
      if (!course) {
        course = storeAdapter.findOne('courses', { slug: id });
      }

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      const sections = storeAdapter.find('sections', { courseId: course._id }).sort((a, b) => a.order - b.order);
      const lessons = storeAdapter.find('lessons', { courseId: course._id }).sort((a, b) => a.order - b.order);

      const curriculum = sections.map(sec => {
        const sectionLessons = lessons.filter(les => les.sectionId.toString() === sec._id.toString());
        return {
          ...sec,
          lessons: sectionLessons
        };
      });

      return res.json({
        success: true,
        data: {
          course,
          curriculum
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Instructor / Admin)
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      level,
      price,
      discountPrice,
      thumbnailUrl,
      requirements = [],
      whatYouWillLearn = []
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'Please provide course title, description, and category.' });
    }

    const instructorId = req.user._id || req.user.id;
    const instructorName = req.user.name;
    const slug = createSlug(title) + '-' + Math.random().toString(36).substr(2, 4);

    if (getDBStatus()) {
      const course = await Course.create({
        title,
        slug,
        subtitle,
        description,
        category,
        level,
        price: Number(price) || 0,
        discountPrice: discountPrice ? Number(discountPrice) : null,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
        instructorId,
        instructorName,
        status: COURSE_STATUS.PUBLISHED, // Auto-published for smooth demo experience
        requirements,
        whatYouWillLearn
      });

      // Create a default first section
      const section = await Section.create({
        courseId: course._id,
        title: 'Section 1: Course Introduction & Fundamentals',
        order: 1
      });

      return res.status(201).json({
        success: true,
        message: 'Course created successfully.',
        data: { course, defaultSection: section }
      });
    } else {
      const course = storeAdapter.insertOne('courses', {
        title,
        slug,
        subtitle,
        description,
        category,
        level,
        price: Number(price) || 0,
        discountPrice: discountPrice ? Number(discountPrice) : null,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
        instructorId: instructorId.toString(),
        instructorName,
        status: COURSE_STATUS.PUBLISHED,
        totalDurationMinutes: 0,
        totalLessons: 0,
        rating: 4.9,
        ratingsCount: 1,
        enrollmentCount: 0,
        requirements,
        whatYouWillLearn
      });

      const section = storeAdapter.insertOne('sections', {
        courseId: course._id,
        title: 'Section 1: Course Introduction & Fundamentals',
        order: 1
      });

      return res.status(201).json({
        success: true,
        message: 'Course created successfully.',
        data: { course, defaultSection: section }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update course details
// @route   PUT /api/courses/:id
// @access  Private (Instructor Owner / Admin)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user._id || req.user.id).toString();

    if (getDBStatus()) {
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      if (course.instructorId.toString() !== userId && req.user.role !== ROLES.ADMIN) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this course.' });
      }

      const updated = await Course.findByIdAndUpdate(id, { $set: req.body }, { new: true });
      return res.json({ success: true, message: 'Course updated successfully.', data: updated });
    } else {
      const course = storeAdapter.findById('courses', id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      if (course.instructorId !== userId && req.user.role !== ROLES.ADMIN) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this course.' });
      }

      const updated = storeAdapter.findByIdAndUpdate('courses', id, req.body);
      return res.json({ success: true, message: 'Course updated successfully.', data: updated });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get courses authored by the current instructor
// @route   GET /api/courses/instructor/my-courses
// @access  Private (Instructor)
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = (req.user._id || req.user.id).toString();

    if (getDBStatus()) {
      const courses = await Course.find({ instructorId }).sort({ createdAt: -1 });
      return res.json({ success: true, data: courses });
    } else {
      const courses = storeAdapter.find('courses', { instructorId });
      courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, data: courses });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Add a section to a course
// @route   POST /api/courses/:id/sections
// @access  Private (Instructor)
exports.addSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, order } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Section title is required.' });
    }

    if (getDBStatus()) {
      const existingSectionsCount = await Section.countDocuments({ courseId: id });
      const section = await Section.create({
        courseId: id,
        title,
        order: order || existingSectionsCount + 1
      });
      return res.status(201).json({ success: true, data: section });
    } else {
      const existing = storeAdapter.find('sections', { courseId: id });
      const section = storeAdapter.insertOne('sections', {
        courseId: id,
        title,
        order: order || existing.length + 1
      });
      return res.status(201).json({ success: true, data: section });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Add a lesson to a section
// @route   POST /api/courses/:id/sections/:sectionId/lessons
// @access  Private (Instructor)
exports.addLesson = async (req, res) => {
  try {
    const { id, sectionId } = req.params;
    const {
      title,
      type = 'video',
      videoUrl,
      cloudFrontUrl,
      durationMinutes = 10,
      durationFormatted = '10:00',
      thumbnailUrl,
      description,
      isFreePreview = false
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Lesson title is required.' });
    }

    if (getDBStatus()) {
      const count = await Lesson.countDocuments({ sectionId });
      const lesson = await Lesson.create({
        courseId: id,
        sectionId,
        title,
        type,
        videoUrl: videoUrl || '',
        cloudFrontUrl: cloudFrontUrl || '',
        durationMinutes: Number(durationMinutes) || 10,
        durationFormatted: durationFormatted || '10:00',
        thumbnailUrl: thumbnailUrl || '',
        description: description || '',
        order: count + 1,
        isFreePreview: Boolean(isFreePreview)
      });

      // Update course total lessons count
      await Course.findByIdAndUpdate(id, { $inc: { totalLessons: 1 } });

      return res.status(201).json({ success: true, data: lesson });
    } else {
      const existing = storeAdapter.find('lessons', { sectionId });
      const lesson = storeAdapter.insertOne('lessons', {
        courseId: id,
        sectionId,
        title,
        type,
        videoUrl: videoUrl || '',
        cloudFrontUrl: cloudFrontUrl || '',
        durationMinutes: Number(durationMinutes) || 10,
        durationFormatted: durationFormatted || '10:00',
        thumbnailUrl: thumbnailUrl || '',
        description: description || '',
        order: existing.length + 1,
        isFreePreview: Boolean(isFreePreview)
      });

      const course = storeAdapter.findById('courses', id);
      if (course) {
        storeAdapter.findByIdAndUpdate('courses', id, { totalLessons: (course.totalLessons || 0) + 1 });
      }

      return res.status(201).json({ success: true, data: lesson });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
