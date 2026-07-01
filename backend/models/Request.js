const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['Submitted', 'In Progress', 'Completed', 'Rejected'],
    default: 'Submitted'
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
