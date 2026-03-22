const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateChatMessage = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message cannot be empty.')
    .isLength({ max: 1000 }).withMessage('Message too long (max 1000 characters).')
    .escape(),
  body('sessionId')
    .trim()
    .notEmpty().withMessage('Session ID is required.')
    .isLength({ max: 100 }).withMessage('Invalid session ID.'),
  body('language')
    .optional()
    .isIn(['en', 'hi']).withMessage('Language must be "en" or "hi".'),
  handleValidationErrors,
];

const validateSessionId = [
  param('sessionId')
    .trim()
    .notEmpty().withMessage('Session ID is required.')
    .isLength({ max: 100 }).withMessage('Invalid session ID.'),
  handleValidationErrors,
];

module.exports = { validateChatMessage, validateSessionId };
