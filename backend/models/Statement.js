const mongoose = require('mongoose');

const statementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  pdfUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Statement', statementSchema);
