const Certificate = require('../models/Certificate');
const storeAdapter = require('../config/store');
const { getDBStatus } = require('../config/db');

// @desc    Get all certificates earned by logged-in student
// @route   GET /api/certificates/my-certificates
// @access  Private (Student)
exports.getMyCertificates = async (req, res) => {
  try {
    const studentId = (req.user._id || req.user.id).toString();

    if (getDBStatus()) {
      const certificates = await Certificate.find({ studentId })
        .populate('courseId', 'title thumbnailUrl category')
        .sort({ issuedDate: -1 });

      return res.json({ success: true, data: certificates });
    } else {
      const certificates = storeAdapter.find('certificates', { studentId });
      const enriched = certificates.map(cert => {
        const course = storeAdapter.findById('courses', cert.courseId);
        return {
          ...cert,
          courseId: course ? { title: course.title, thumbnailUrl: course.thumbnailUrl, category: course.category } : null
        };
      });
      enriched.sort((a, b) => new Date(b.issuedDate) - new Date(a.issuedDate));
      return res.json({ success: true, data: enriched });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Verify certificate by unique certificate number
// @route   GET /api/certificates/verify/:certNumber
// @access  Public
exports.verifyCertificate = async (req, res) => {
  try {
    const { certNumber } = req.params;

    if (getDBStatus()) {
      const cert = await Certificate.findOne({ certificateNumber: certNumber });
      if (!cert) {
        return res.status(404).json({ success: false, message: 'Certificate not found or invalid serial number.' });
      }

      return res.json({
        success: true,
        message: 'Certificate is authentic and verified by Nexvia Technologies.',
        data: cert
      });
    } else {
      const cert = storeAdapter.findOne('certificates', { certificateNumber: certNumber });
      if (!cert) {
        return res.status(404).json({ success: false, message: 'Certificate not found or invalid serial number.' });
      }

      return res.json({
        success: true,
        message: 'Certificate is authentic and verified by Nexvia Technologies.',
        data: cert
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
