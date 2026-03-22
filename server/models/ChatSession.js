const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ['product_discovery', 'rental_guidance', 'listing_help', 'faq', 'support', 'general', 'unknown'],
    default: 'general',
  },
});

const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, default: null },
    messages: [messageSchema],
    language: { type: String, enum: ['en', 'hi'], default: 'en' },
    isActive: { type: Boolean, default: true },
    metadata: {
      userAgent: String,
      ipAddress: String,
      location: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatSession', chatSessionSchema);
