const path = require('path');
const fs = require('fs');
const MediaAsset = require('../models/MediaAsset');
const storeAdapter = require('../config/store');
const { getDBStatus } = require('../config/db');
const { queueService } = require('../services/bullQueueService');
const cloudFrontService = require('../services/cloudFrontService');
const { MEDIA_STATUS } = require('../config/constants');
const { VIDEOS_DIR, THUMBNAILS_DIR } = require('../middleware/upload');

// @desc    Upload video lesson file & queue for FFmpeg processing
// @route   POST /api/media/upload-video
// @access  Private (Instructor / Admin)
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a video file to upload.' });
    }

    const { lessonId } = req.body;
    const file = req.file;
    const relativeStoragePath = `/uploads/videos/${file.filename}`;
    const cloudFrontUrl = cloudFrontService.getMediaUrl(relativeStoragePath);

    let mediaAsset;

    if (getDBStatus()) {
      mediaAsset = await MediaAsset.create({
        originalFilename: file.originalname,
        storagePath: relativeStoragePath,
        mimeType: file.mimetype,
        fileSize: file.size,
        cloudFrontUrl,
        processingStatus: MEDIA_STATUS.PENDING,
        processingProgress: 0
      });
    } else {
      mediaAsset = storeAdapter.insertOne('mediaAssets', {
        originalFilename: file.originalname,
        storagePath: relativeStoragePath,
        mimeType: file.mimetype,
        fileSize: file.size,
        cloudFrontUrl,
        processingStatus: MEDIA_STATUS.PENDING,
        processingProgress: 0
      });
    }

    // Enqueue FFmpeg background job via BullMQ
    const { jobId, queueType } = await queueService.addVideoProcessingJob(
      mediaAsset._id.toString(),
      file.path,
      lessonId
    );

    if (getDBStatus()) {
      await MediaAsset.findByIdAndUpdate(mediaAsset._id, { jobId });
    } else {
      storeAdapter.findByIdAndUpdate('mediaAssets', mediaAsset._id, { jobId });
    }

    return res.status(201).json({
      success: true,
      message: 'Video uploaded successfully. Background processing started.',
      data: {
        mediaAssetId: mediaAsset._id,
        videoUrl: relativeStoragePath,
        cloudFrontUrl,
        jobId,
        queueType
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Upload course thumbnail image
// @route   POST /api/media/upload-thumbnail
// @access  Private (Instructor / Admin)
exports.uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }

    const relativePath = `/uploads/thumbnails/${req.file.filename}`;
    const cloudFrontUrl = cloudFrontService.getMediaUrl(relativePath);

    return res.status(201).json({
      success: true,
      message: 'Thumbnail uploaded successfully.',
      data: {
        url: relativePath,
        cloudFrontUrl
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    HTTP 206 Partial Content video streaming endpoint
// @route   GET /api/media/stream/:filename
// @access  Public
exports.streamVideo = (req, res) => {
  try {
    const { filename } = req.params;
    const videoPath = path.join(VIDEOS_DIR, filename);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ success: false, message: 'Video file not found.' });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Byte Range Request for seeking/scrubbing
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
        return;
      }

      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Entire file stream
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get media processing status
// @route   GET /api/media/status/:id
// @access  Private
exports.getMediaStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const asset = await MediaAsset.findById(id);
      if (!asset) return res.status(404).json({ success: false, message: 'Media asset not found.' });
      return res.json({ success: true, data: asset });
    } else {
      const asset = storeAdapter.findById('mediaAssets', id);
      if (!asset) return res.status(404).json({ success: false, message: 'Media asset not found.' });
      return res.json({ success: true, data: asset });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
