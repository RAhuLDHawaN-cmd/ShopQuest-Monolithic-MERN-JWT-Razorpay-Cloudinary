const express = require('express');
const { getAdminStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/protectMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', protect, admin, getAdminStats);

module.exports = router;
