const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fundName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Equity', 'Debt', 'Liquid'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  units: {
    type: Number,
    required: true
  },
  currentValue: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);
