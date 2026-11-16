/**
 * BullMQ Background Job Queue Service
 * Handles asynchronous media processing, thumbnail generation, and certificates.
 * Automatically falls back to an in-process resilient queue runner if Redis is offline.
 */
const { Queue, Worker } = require('bullmq');
const { getRedisClient, getRedisStatus } = require('../config/redis');
const ffmpegService = require('./ffmpegService');
const MediaAsset = require('../models/MediaAsset');
const Lesson = require('../models/Lesson');
const storeAdapter = require('../config/store');
const { getDBStatus } = require('../config/db');
const { MEDIA_STATUS } = require('../config/constants');
const path = require('path');
const { THUMBNAILS_DIR } = require('../middleware/upload');

let mediaQueue = null;
let mediaWorker = null;

// Core Job Processor logic (shared between BullMQ and resilient in-process runner)
const processVideoJob = async (jobData, updateProgress) => {
  const { mediaAssetId, filePath, lessonId } = jobData;
  console.log(`[Queue Worker] Processing video job for media asset: ${mediaAssetId}`);

  try {
    if (updateProgress) updateProgress(10);

    // 1. Extract metadata via FFprobe
    const metadata = await ffmpegService.getMetadata(filePath);
    console.log(`[Queue Worker] Metadata extracted: ${metadata.resolution}, ${metadata.durationFormatted}`);
    if (updateProgress) updateProgress(40);

    // 2. Generate video thumbnail
    const thumbResult = await ffmpegService.generateThumbnail(filePath, THUMBNAILS_DIR, '00:00:02');
    console.log(`[Queue Worker] Thumbnail generated: ${thumbResult.relativeUrl}`);
    if (updateProgress) updateProgress(80);

    // 3. Update MediaAsset record
    if (getDBStatus()) {
      await MediaAsset.findByIdAndUpdate(mediaAssetId, {
        $set: {
          durationSeconds: metadata.durationSeconds,
          resolution: metadata.resolution,
          thumbnailUrl: thumbResult.relativeUrl,
          processingStatus: MEDIA_STATUS.COMPLETED,
          processingProgress: 100
        }
      });

      if (lessonId) {
        await Lesson.findByIdAndUpdate(lessonId, {
          $set: {
            durationMinutes: Math.round(metadata.durationSeconds / 60) || 5,
            durationFormatted: metadata.durationFormatted,
            thumbnailUrl: thumbResult.relativeUrl
          }
        });
      }
    } else {
      storeAdapter.findByIdAndUpdate('mediaAssets', mediaAssetId, {
        durationSeconds: metadata.durationSeconds,
        resolution: metadata.resolution,
        thumbnailUrl: thumbResult.relativeUrl,
        processingStatus: MEDIA_STATUS.COMPLETED,
        processingProgress: 100
      });

      if (lessonId) {
        storeAdapter.findByIdAndUpdate('lessons', lessonId, {
          durationMinutes: Math.round(metadata.durationSeconds / 60) || 5,
          durationFormatted: metadata.durationFormatted,
          thumbnailUrl: thumbResult.relativeUrl
        });
      }
    }

    if (updateProgress) updateProgress(100);
    console.log(`[Queue Worker] Video job completed successfully for ${mediaAssetId}`);
    return { success: true, metadata, thumbnail: thumbResult.relativeUrl };
  } catch (err) {
    console.error(`[Queue Worker] Video job failed for ${mediaAssetId}:`, err.message);

    if (getDBStatus()) {
      await MediaAsset.findByIdAndUpdate(mediaAssetId, {
        $set: { processingStatus: MEDIA_STATUS.FAILED, errorMessage: err.message }
      });
    } else {
      storeAdapter.findByIdAndUpdate('mediaAssets', mediaAssetId, {
        processingStatus: MEDIA_STATUS.FAILED,
        errorMessage: err.message
      });
    }
    throw err;
  }
};

const initBullMQ = () => {
  const redis = getRedisClient();

  if (getRedisStatus() && redis) {
    try {
      mediaQueue = new Queue('video-processing', { connection: redis });
      mediaWorker = new Worker(
        'video-processing',
        async (job) => {
          return await processVideoJob(job.data, (progress) => job.updateProgress(progress));
        },
        { connection: redis, concurrency: 2 }
      );

      mediaWorker.on('completed', (job) => {
        console.log(`[BullMQ] Job ${job.id} completed successfully.`);
      });

      mediaWorker.on('failed', (job, err) => {
        console.error(`[BullMQ] Job ${job.id} failed with error:`, err.message);
      });

      console.log('[BullMQ] Video processing queue & worker initialized.');
    } catch (e) {
      console.warn('[BullMQ] Failed to bind BullMQ to Redis. Fallback runner active.');
    }
  }
};

const queueService = {
  async addVideoProcessingJob(mediaAssetId, filePath, lessonId = null) {
    if (mediaQueue && getRedisStatus()) {
      try {
        const job = await mediaQueue.add('transcode-and-thumb', {
          mediaAssetId,
          filePath,
          lessonId
        }, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 }
        });

        return { jobId: job.id, queueType: 'bullmq' };
      } catch (err) {
        console.warn('[BullMQ] Enqueue error, executing with in-process runner:', err.message);
      }
    }

    // In-process resilient asynchronous runner
    const pseudoJobId = 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    setImmediate(async () => {
      try {
        await processVideoJob({ mediaAssetId, filePath, lessonId });
      } catch (err) {
        console.error('[In-Process Runner Error]:', err.message);
      }
    });

    return { jobId: pseudoJobId, queueType: 'in-process' };
  }
};

module.exports = {
  initBullMQ,
  queueService
};
