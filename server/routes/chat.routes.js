const express = require('express');
const router = express.Router();
const ChatSession = require('../models/ChatSession');
const { generateChatResponse, getProductRecommendations } = require('../services/gemini.service');
const { trackQuery } = require('../services/analytics.service');
const { chatLimiter } = require('../middleware/rateLimiter');
const { validateChatMessage, validateSessionId } = require('../middleware/inputValidator');

// POST /api/chat - Main chat endpoint
router.post('/', chatLimiter, validateChatMessage, async (req, res, next) => {
  try {
    const { sessionId, message, language = 'en' } = req.body;

    const result = await generateChatResponse(sessionId, message, language);

    // Track analytics asynchronously (non-blocking)
    trackQuery(message, result.category, language, sessionId).catch(() => {});

    res.json({
      success: true,
      sessionId: result.sessionId,
      reply: result.reply,
      category: result.category,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/chat/:sessionId - Get chat session history
router.get('/:sessionId', validateSessionId, async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found.' });
    }
    res.json({
      success: true,
      sessionId: session.sessionId,
      language: session.language,
      messages: session.messages,
      createdAt: session.createdAt,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/chat/:sessionId/recommendations - Get product recommendations
router.get('/:sessionId/recommendations', validateSessionId, async (req, res, next) => {
  try {
    const { category = 'books', budget, duration } = req.query;
    const recommendations = getProductRecommendations(category, budget, duration);
    res.json({ success: true, category, recommendations });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
