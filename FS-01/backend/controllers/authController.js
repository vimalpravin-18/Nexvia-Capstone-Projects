const jwt = require('jsonwebtoken');
const store = require('../config/store');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_nexvia_2026';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role = 'customer', storeName, description } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = store.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email,
      password,
      role: role === 'vendor' ? 'vendor' : 'customer',
      vendorProfile: role === 'vendor' ? {
        storeName: storeName || `${name}'s Store`,
        description: description || 'Multi-category verified store',
        commissionRate: 10,
        balance: 0,
        totalSales: 0,
        status: 'approved'
      } : null,
      createdAt: new Date().toISOString()
    };

    store.createUser(newUser);

    const token = generateToken(newUser.id, newUser.role);
    res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        vendorProfile: newUser.vendorProfile
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = store.findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.role);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorProfile: user.vendorProfile
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        vendorProfile: req.user.vendorProfile
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVendorProfile = async (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can update vendor profile' });
    }

    const { storeName, description } = req.body;
    const currentProfile = req.user.vendorProfile || {};
    const updatedProfile = {
      ...currentProfile,
      storeName: storeName || currentProfile.storeName,
      description: description || currentProfile.description
    };

    const updatedUser = store.updateUser(req.user.id, { vendorProfile: updatedProfile });
    res.json({
      message: 'Vendor profile updated successfully',
      vendorProfile: updatedUser.vendorProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateVendorProfile
};

