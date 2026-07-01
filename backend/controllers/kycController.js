const KYC = require('../models/KYC');
const User = require('../models/User');

const uploadKYCDocuments = async (req, res) => {
  try {
    if (!req.files || !req.files.pan || !req.files.aadhaar || !req.files.addressProof) {
      return res.status(400).json({ message: 'All 3 documents are required.' });
    }

    const panPath = req.files.pan[0].path;
    const aadhaarPath = req.files.aadhaar[0].path;
    const addressProofPath = req.files.addressProof[0].path;

    let kycRecord = await KYC.findOne({ userId: req.user._id });

    if (kycRecord) {
      kycRecord.panPath = panPath;
      kycRecord.aadhaarPath = aadhaarPath;
      kycRecord.addressProofPath = addressProofPath;
      kycRecord.status = 'Under Review';
      kycRecord.remarks = '';
      await kycRecord.save();
    } else {
      kycRecord = await KYC.create({
        userId: req.user._id,
        panPath,
        aadhaarPath,
        addressProofPath,
        status: 'Under Review'
      });
    }

    await User.findByIdAndUpdate(req.user._id, { kycStatus: 'Submitted' });

    res.status(201).json(kycRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getKYCStatus = async (req, res) => {
  try {
    const kycRecord = await KYC.findOne({ userId: req.user._id });
    res.json(kycRecord || { status: 'Pending' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingKYC = async (req, res) => {
  try {
    const pendingKYCs = await KYC.find({ status: 'Under Review' }).populate('userId', 'name email mobile');
    res.json(pendingKYCs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateKYCStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const kycRecord = await KYC.findById(req.params.id);

    if (!kycRecord) {
      return res.status(404).json({ message: 'KYC record not found' });
    }

    kycRecord.status = status;
    kycRecord.remarks = remarks;
    await kycRecord.save();

    let userKycStatus = 'Pending';
    if (status === 'Approved') userKycStatus = 'Approved';
    if (status === 'Rejected') userKycStatus = 'Rejected';

    await User.findByIdAndUpdate(kycRecord.userId, { kycStatus: userKycStatus });

    res.json(kycRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadKYCDocuments,
  getKYCStatus,
  getPendingKYC,
  updateKYCStatus
};
