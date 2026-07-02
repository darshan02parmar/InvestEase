const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  panPath: { type: String, required: true },
  aadhaarPath: { type: String, required: true },
  addressProofPath: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  remarks: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  rejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('KYC', kycSchema);
