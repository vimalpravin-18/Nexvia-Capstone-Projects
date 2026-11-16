const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getVendorsList,
  toggleVendorStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getAdminAnalytics);
router.get('/vendors', getVendorsList);
router.put('/vendors/:id/toggle-status', toggleVendorStatus);

module.exports = router;

