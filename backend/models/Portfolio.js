const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalValue: { type: Number, required: true, default: 0 },
  todayChange: { type: Number, required: true, default: 0 },
  allocation: {
    equity: { type: Number, required: true, default: 0 },
    debt: { type: Number, required: true, default: 0 },
    liquid: { type: Number, required: true, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
