/**
 * AWS CloudFront Media Delivery Service
 * Resolves media URLs via AWS CloudFront CDN distribution when configured.
 * Safely falls back to local byte-range video streaming endpoint when CloudFront is unconfigured.
 */

const cloudFrontService = {
  /**
   * Get the delivery URL for a media asset
   * @param {string} relativeOrKey - Relative file path or S3 key (e.g., 'videos/lesson-1.mp4')
   * @param {boolean} isSecure - Whether signed URL / token verification is required
   */
  getMediaUrl(relativeOrKey, isSecure = false) {
    const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN;
    const cleanKey = relativeOrKey.replace(/^\/+/, '').replace(/^uploads\//, '');

    if (cloudFrontDomain) {
      const normalizedDomain = cloudFrontDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
      const url = `https://${normalizedDomain}/${cleanKey}`;
      return url;
    }

    // Local delivery URL fallback
    return `/uploads/${cleanKey}`;
  },

  /**
   * Check if CloudFront distribution is configured
   */
  isConfigured() {
    return Boolean(process.env.CLOUDFRONT_DOMAIN);
  },

  /**
   * Get CDN configuration status (for health and admin views)
   */
  getStatus() {
    return {
      enabled: this.isConfigured(),
      domain: process.env.CLOUDFRONT_DOMAIN || 'Not configured (using local media streaming)',
      region: process.env.AWS_REGION || 'ap-southeast-2',
      s3Bucket: process.env.AWS_S3_BUCKET || 'Not configured'
    };
  }
};

module.exports = cloudFrontService;
