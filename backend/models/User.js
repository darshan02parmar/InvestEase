const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  kycStatus: {
    type: String,
    enum: ['Pending', 'Submitted', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  role: {
    type: String,
    enum: ['investor', 'admin'],
    default: 'investor'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
