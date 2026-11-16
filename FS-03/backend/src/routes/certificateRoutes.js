const express = require('express');
const router = express.Router();
const { getMyCertificates, verifyCertificate } = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');

router.get('/my-certificates', protect, getMyCertificates);
router.get('/verify/:certNumber', verifyCertificate);

module.exports = router;
