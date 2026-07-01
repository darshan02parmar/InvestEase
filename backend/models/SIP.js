const mongoose = require('mongoose');

const sipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fundName: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, required: true, default: 'Monthly' },
  status: {
    type: String,
    enum: ['Active', 'Paused', 'Failed', 'Cancelled'],
    default: 'Active'
  },
  nextDebit: { type: Date, required: true },
  failureReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SIP', sipSchema);
