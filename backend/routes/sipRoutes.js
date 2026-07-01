const express = require('express');
const { getSIPs, retrySIP } = require('../controllers/sipController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getSIPs);

router.post('/:id/retry', protect, retrySIP);

module.exports = router;
