/**
 * AWS S3 Upload & CloudFront CDN Media Service
 * Handles uploading transcoded videos and thumbnails to Amazon S3
 * and resolving URLs through Amazon CloudFront CDN distributions.
 */
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');

let s3Client = null;

const getS3Client = () => {
  if (s3Client) return s3Client;

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || 'us-east-1';

  if (!accessKeyId || !secretAccessKey || accessKeyId === 'your_aws_access_key_id') {
    return null;
  }

  s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });

  return s3Client;
};

const s3Service = {
  isConfigured() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucket = process.env.AWS_S3_BUCKET;

    return Boolean(
      accessKeyId && 
      secretAccessKey && 
      bucket &&
      accessKeyId !== 'your_aws_access_key_id'
    );
  },

  async uploadFile(localFilePath, s3Key, contentType = 'application/octet-stream') {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const client = getS3Client();
      const bucket = process.env.AWS_S3_BUCKET;
      const fileStream = fs.createReadStream(localFilePath);

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: s3Key,
        Body: fileStream,
        ContentType: contentType
      });

      await client.send(command);

      // Return CloudFront CDN URL if configured, otherwise S3 URL
      const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN;
      if (cloudFrontDomain) {
        const cleanDomain = cloudFrontDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
        return `https://${cleanDomain}/${s3Key}`;
      }

      const region = process.env.AWS_REGION || 'us-east-1';
      return `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;
    } catch (err) {
      console.error('[AWS S3] Upload failed:', err.message);
      return null;
    }
  },

  getStatus() {
    const configured = this.isConfigured();
    const cfDomain = process.env.CLOUDFRONT_DOMAIN;

    return {
      s3Enabled: configured,
      bucket: process.env.AWS_S3_BUCKET || 'Not configured',
      region: process.env.AWS_REGION || 'us-east-1',
      cloudFrontEnabled: Boolean(cfDomain),
      cloudFrontDomain: cfDomain || 'Not configured (using local media streaming fallback)'
    };
  }
};

module.exports = s3Service;
