const Portfolio = require('../models/Portfolio');

const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (portfolio) {
      res.json(portfolio);
    } else {
      res.status(404).json({ message: 'Portfolio not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPortfolio };
