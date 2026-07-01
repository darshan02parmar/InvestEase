const express = require('express');
const {
  getNominees,
  createNominee,
  updateNominee,
  deleteNominee
} = require('../controllers/nomineeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getNominees)
  .post(protect, createNominee);

router.route('/:id')
  .put(protect, updateNominee)
  .delete(protect, deleteNominee);

module.exports = router;
