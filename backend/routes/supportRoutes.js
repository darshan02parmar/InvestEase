const express = require('express');
const { getRequests, createRequest, getAdminRequests, updateRequestStatus } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const adminOnly = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

router.route('/')
  .get(protect, getRequests)
  .post(protect, createRequest);

router.get('/admin/tickets', protect, adminOnly, getAdminRequests);
router.put('/admin/tickets/:id', protect, adminOnly, updateRequestStatus);

module.exports = router;
