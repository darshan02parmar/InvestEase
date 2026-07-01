const express = require('express');
const { getStatements, generateStatement } = require('../controllers/statementController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getStatements);

router.post('/generate', protect, generateStatement);

module.exports = router;
