const mongoose = require('mongoose');
const { MEDIA_STATUS } = require('../config/constants');

const mediaAssetSchema = new mongoose.Schema(
  {
    originalFilename: {
      type: String,
      required: true
    },
    storagePath: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    durationSeconds: {
      type: Number,
      default: 0
    },
    resolution: {
      type: String,
      default: '1080p'
    },
    thumbnailUrl: {
      type: String,
      default: ''
    },
    hlsUrl: {
      type: String,
      default: ''
    },
    cloudFrontUrl: {
      type: String,
      default: ''
    },
    processingStatus: {
      type: String,
      enum: Object.values(MEDIA_STATUS),
      default: MEDIA_STATUS.PENDING
    },
    processingProgress: {
      type: Number,
      default: 0
    },
    errorMessage: {
      type: String,
      default: ''
    },
    jobId: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.MediaAsset || mongoose.model('MediaAsset', mediaAssetSchema);
