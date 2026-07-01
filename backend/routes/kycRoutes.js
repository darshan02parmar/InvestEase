const express = require('express');
const { 
  uploadKYCDocuments, 
  getKYCStatus, 
  getPendingKYC, 
  updateKYCStatus 
} = require('../controllers/kycController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const User = require('../models/User');

const router = express.Router();

const adminOnly = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

router.post('/upload', protect, upload.fields([
  { name: 'pan', maxCount: 1 },
  { name: 'aadhaar', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 }
]), uploadKYCDocuments);

router.get('/status', protect, getKYCStatus);

router.get('/admin/pending', protect, adminOnly, getPendingKYC);
router.put('/admin/:id', protect, adminOnly, updateKYCStatus);

module.exports = router;
