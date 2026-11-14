const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Memory storage for S3 uploads or Disk storage for local fallback
const memoryStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `prod_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const isS3Configured = () => {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET &&
    !process.env.AWS_ACCESS_KEY_ID.includes('placeholder')
  );
};

const upload = multer({
  storage: isS3Configured() ? memoryStorage : diskStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed'));
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // If AWS S3 credentials are provided, upload to Amazon S3
  if (isS3Configured()) {
    try {
      const region = process.env.AWS_REGION || 'ap-south-1';
      const bucket = process.env.AWS_S3_BUCKET;
      const fileKey = `products/prod_${Date.now()}_${path.basename(req.file.originalname)}`;

      const s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
      });

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      });

      await s3Client.send(command);

      const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/${fileKey}`;
      return res.json({
        message: 'Image uploaded to AWS S3 successfully',
        url: s3Url,
        storageType: 's3'
      });
    } catch (err) {
      console.error('AWS S3 Upload Error:', err.message);
      return res.status(500).json({ message: `AWS S3 Upload failed: ${err.message}` });
    }
  }

  // Local storage fallback
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    message: 'Image uploaded locally',
    url: fileUrl,
    filename: req.file.filename,
    storageType: 'local'
  });
});

router.post('/s3-presign', (req, res) => {
  const { fileName, fileType } = req.body;
  const bucket = process.env.AWS_S3_BUCKET || 'nexvia-marketplace-products';
  const region = process.env.AWS_REGION || 'ap-south-1';
  const objectKey = `products/${Date.now()}_${fileName || 'product.jpg'}`;

  res.json({
    uploadUrl: `https://${bucket}.s3.${region}.amazonaws.com/${objectKey}`,
    fileUrl: `https://${bucket}.s3.${region}.amazonaws.com/${objectKey}`,
    key: objectKey,
    headers: { 'Content-Type': fileType || 'image/jpeg' }
  });
});

module.exports = router;
