const express = require('express');
const router = express.Router();
const { getAnalyticsSummary } = require('../services/analytics.service');
const { generalLimiter } = require('../middleware/rateLimiter');

// GET /api/analytics - Get analytics summary
router.get('/', generalLimiter, async (req, res, next) => {
  try {
    const data = await getAnalyticsSummary();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
