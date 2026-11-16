const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const InstructorProfile = require('../models/InstructorProfile');
const storeAdapter = require('../config/store');
const { getDBStatus } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (Student or Instructor)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = ROLES.STUDENT, title, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const assignedRole = [ROLES.STUDENT, ROLES.INSTRUCTOR].includes(role) ? role : ROLES.STUDENT;

    if (getDBStatus()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: assignedRole,
        title: title || (assignedRole === ROLES.INSTRUCTOR ? 'Senior Instructor' : 'Student'),
        bio: bio || ''
      });

      if (assignedRole === ROLES.STUDENT) {
        await StudentProfile.create({ userId: user._id });
      } else if (assignedRole === ROLES.INSTRUCTOR) {
        await InstructorProfile.create({ userId: user._id, headline: title || 'Professional Instructor' });
      }

      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            title: user.title
          },
          token
        }
      });
    } else {
      // Local persistent store
      const existingUser = storeAdapter.findOne('users', { email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = storeAdapter.insertOne('users', {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: assignedRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        title: title || (assignedRole === ROLES.INSTRUCTOR ? 'Senior Instructor' : 'Student'),
        bio: bio || '',
        isActive: true
      });

      if (assignedRole === ROLES.STUDENT) {
        storeAdapter.insertOne('studentProfiles', { userId: newUser._id, enrolledCoursesCount: 0, completedCoursesCount: 0, certificatesEarned: 0 });
      } else if (assignedRole === ROLES.INSTRUCTOR) {
        storeAdapter.insertOne('instructorProfiles', { userId: newUser._id, headline: title || 'Professional Instructor', totalStudents: 0, totalCourses: 0, totalRevenue: 0 });
      }

      const token = generateToken(newUser._id, newUser.role);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        data: {
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar,
            title: newUser.title
          },
          token
        }
      });
    }
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error during registration.' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = generateToken(user._id, user.role);

      return res.json({
        success: true,
        message: 'Login successful.',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            title: user.title
          },
          token
        }
      });
    } else {
      const user = storeAdapter.findOne('users', { email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = generateToken(user._id, user.role);

      return res.json({
        success: true,
        message: 'Login successful.',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            title: user.title
          },
          token
        }
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error during login.' });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    let profile = null;

    if (getDBStatus()) {
      const user = await User.findById(req.user._id || req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.role === ROLES.STUDENT) {
        profile = await StudentProfile.findOne({ userId: user._id });
      } else if (user.role === ROLES.INSTRUCTOR) {
        profile = await InstructorProfile.findOne({ userId: user._id });
      }

      return res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            title: user.title,
            bio: user.bio,
            createdAt: user.createdAt
          },
          profile
        }
      });
    } else {
      const user = storeAdapter.findById('users', req.user._id || req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.role === ROLES.STUDENT) {
        profile = storeAdapter.findOne('studentProfiles', { userId: user._id });
      } else if (user.role === ROLES.INSTRUCTOR) {
        profile = storeAdapter.findOne('instructorProfiles', { userId: user._id });
      }

      const { password, ...safeUser } = user;
      return res.json({
        success: true,
        data: {
          user: safeUser,
          profile
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, title, bio, avatar } = req.body;
    const userId = req.user._id || req.user.id;

    if (getDBStatus()) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { ...(name && { name }), ...(title && { title }), ...(bio && { bio }), ...(avatar && { avatar }) } },
        { new: true }
      );
      return res.json({ success: true, message: 'Profile updated successfully.', data: updatedUser });
    } else {
      const updated = storeAdapter.findByIdAndUpdate('users', userId, {
        ...(name && { name }),
        ...(title && { title }),
        ...(bio && { bio }),
        ...(avatar && { avatar })
      });
      const { password, ...safeUser } = updated;
      return res.json({ success: true, message: 'Profile updated successfully.', data: safeUser });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
