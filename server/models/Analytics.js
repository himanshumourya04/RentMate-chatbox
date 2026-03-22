const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    query: { type: String, required: true },
    category: {
      type: String,
      enum: ['product_discovery', 'rental_guidance', 'listing_help', 'faq', 'support', 'general', 'unknown'],
      default: 'general',
    },
    language: { type: String, enum: ['en', 'hi'], default: 'en' },
    sessionId: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

analyticsSchema.index({ category: 1, date: -1 });
analyticsSchema.index({ date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
