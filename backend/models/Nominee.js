const mongoose = require('mongoose');

const nomineeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  dob: { type: Date, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  share: { type: Number, required: true, min: 1, max: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Nominee', nomineeSchema);
