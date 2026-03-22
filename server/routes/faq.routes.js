const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const { generalLimiter } = require('../middleware/rateLimiter');

// GET /api/faqs - List all FAQs (with optional category filter)
router.get('/', generalLimiter, async (req, res, next) => {
  try {
    const { category, lang = 'en', search } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const faqs = await FAQ.find(query).sort({ hitCount: -1 }).limit(20);

    const formatted = faqs.map((faq) => ({
      id: faq._id,
      question: lang === 'hi' && faq.questionHi ? faq.questionHi : faq.question,
      answer: lang === 'hi' && faq.answerHi ? faq.answerHi : faq.answer,
      category: faq.category,
      hitCount: faq.hitCount,
    }));

    res.json({ success: true, count: formatted.length, faqs: formatted });
  } catch (error) {
    next(error);
  }
});

// POST /api/faqs/:id/hit - Increment FAQ hit count
router.post('/:id/hit', async (req, res, next) => {
  try {
    await FAQ.findByIdAndUpdate(req.params.id, { $inc: { hitCount: 1 } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
