const express = require('express');
const router = express.Router();
const {
  uploadVideo,
  uploadThumbnail,
  streamVideo,
  getMediaStatus
} = require('../controllers/mediaController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { ROLES } = require('../config/constants');
const cloudFrontService = require('../services/cloudFrontService');

// Public video stream with byte range support
router.get('/stream/:filename', streamVideo);

// CloudFront & Media service health status
router.get('/config-status', (req, res) => {
  res.json({ success: true, data: cloudFrontService.getStatus() });
});

// Protected upload endpoints
router.post(
  '/upload-video',
  protect,
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  upload.single('video'),
  uploadVideo
);

router.post(
  '/upload-thumbnail',
  protect,
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  upload.single('thumbnail'),
  uploadThumbnail
);

router.get('/status/:id', protect, getMediaStatus);

module.exports = router;
