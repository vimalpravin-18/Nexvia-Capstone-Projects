/**
 * FFmpeg Video & Media Processing Service
 * Provides automated video transcoding, thumbnail extraction, metadata probing, and faststart optimization.
 */
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const ffmpegService = {
  /**
   * Probe video file metadata (duration, resolution, bitrate, streams)
   */
  async getMetadata(filePath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);

        const videoStream = metadata.streams.find(s => s.codec_type === 'video') || {};
        const audioStream = metadata.streams.find(s => s.codec_type === 'audio') || {};

        const durationSeconds = Math.round(metadata.format.duration || 0);
        const width = videoStream.width || 1280;
        const height = videoStream.height || 720;
        const resolution = `${width}x${height} (${height >= 1080 ? '1080p' : height >= 720 ? '720p' : '480p'})`;

        resolve({
          durationSeconds,
          durationFormatted: this.formatDuration(durationSeconds),
          resolution,
          width,
          height,
          bitrate: metadata.format.bit_rate,
          videoCodec: videoStream.codec_name,
          audioCodec: audioStream.codec_name
        });
      });
    });
  },

  /**
   * Generate thumbnail snapshot from video
   */
  async generateThumbnail(videoPath, outputDir, timestamp = '00:00:02') {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const filename = `thumb-${Date.now()}-${Math.round(Math.random() * 1e6)}.jpg`;

      ffmpeg(videoPath)
        .screenshots({
          timestamps: [timestamp],
          filename,
          folder: outputDir,
          size: '640x360'
        })
        .on('end', () => {
          resolve({
            filename,
            fullPath: path.join(outputDir, filename),
            relativeUrl: `/uploads/thumbnails/${filename}`
          });
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  },

  /**
   * Transcode / Optimize video for Web (H.264 + AAC + Faststart)
   */
  async optimizeForWeb(inputPath, outputPath, onProgress) {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-movflags +faststart',
          '-pix_fmt yuv420p',
          '-preset fast',
          '-crf 23'
        ])
        .on('progress', (progress) => {
          if (onProgress && progress.percent) {
            onProgress(Math.min(100, Math.round(progress.percent)));
          }
        })
        .on('end', () => {
          resolve(outputPath);
        })
        .on('error', (err) => {
          reject(err);
        })
        .save(outputPath);
    });
  },

  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
};

module.exports = ffmpegService;
