const Portfolio = require('../models/Portfolio');
const Investment = require('../models/Investment');

const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    const investments = await Investment.find({ userId: req.user._id });
    
    if (portfolio) {
      res.json({ portfolio, investments });
    } else {
      res.status(404).json({ message: 'Portfolio not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPortfolio };
