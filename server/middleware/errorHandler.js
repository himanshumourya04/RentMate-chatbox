const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error [${req.method} ${req.path}]:`, err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ success: false, error: 'Duplicate entry.' });
  }

  // OpenAI errors
  if (err.status === 401) {
    return res.status(500).json({ success: false, error: 'AI service authentication failed.' });
  }
  if (err.status === 429) {
    return res.status(429).json({ success: false, error: 'AI service rate limit reached. Please try again.' });
  }

  // Default
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
