const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    questionHi: { type: String, default: '' },
    answerHi: { type: String, default: '' },
    category: {
      type: String,
      enum: ['payment', 'return_policy', 'damage_policy', 'account', 'general', 'listing', 'renting'],
      required: true,
    },
    keywords: [String],
    hitCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

faqSchema.index({ keywords: 1, category: 1 });

module.exports = mongoose.model('FAQ', faqSchema);
