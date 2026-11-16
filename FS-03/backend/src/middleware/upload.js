/**
 * File Upload Middleware with Multer
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
const VIDEOS_DIR = path.join(UPLOADS_DIR, 'videos');
const THUMBNAILS_DIR = path.join(UPLOADS_DIR, 'thumbnails');
const CERTIFICATES_DIR = path.join(UPLOADS_DIR, 'certificates');

[UPLOADS_DIR, VIDEOS_DIR, THUMBNAILS_DIR, CERTIFICATES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, VIDEOS_DIR);
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, THUMBNAILS_DIR);
    } else {
      cb(null, UPLOADS_DIR);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedVideoTypes = ['video/mp4', 'video/mkv', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

  if (allowedVideoTypes.includes(file.mimetype) || allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed types: MP4, MKV, MOV, WEBM, JPG, PNG, WEBP.`), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500 MB limit
  },
  fileFilter
});

module.exports = {
  upload,
  UPLOADS_DIR,
  VIDEOS_DIR,
  THUMBNAILS_DIR,
  CERTIFICATES_DIR
};
