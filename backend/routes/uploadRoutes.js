const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `prod_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
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

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    message: 'Image uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
    storageType: process.env.AWS_S3_BUCKET ? 's3' : 'local'
  });
});

router.post('/s3-presign', (req, res) => {
  const { fileName, fileType } = req.body;
  const bucket = process.env.AWS_S3_BUCKET || 'nexvia-marketplace-products';
  const objectKey = `products/${Date.now()}_${fileName || 'product.jpg'}`;

  res.json({
    uploadUrl: `https://${bucket}.s3.amazonaws.com/${objectKey}`,
    fileUrl: `https://${bucket}.s3.amazonaws.com/${objectKey}`,
    key: objectKey,
    headers: { 'Content-Type': fileType || 'image/jpeg' }
  });
});

module.exports = router;
