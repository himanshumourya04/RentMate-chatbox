const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX) || 30,
  message: {
    success: false,
    error: 'Too many requests. Please wait a moment before sending another message.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, error: 'Rate limit exceeded.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { chatLimiter, generalLimiter };
