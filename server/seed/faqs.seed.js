require('dotenv').config();
const mongoose = require('mongoose');
const FAQ = require('../models/FAQ');

const faqs = [
  // Payment FAQs
  {
    question: 'How do I pay for a rental?',
    answer: 'You can pay using UPI, Debit/Credit Cards, or Net Banking. Payment is held in a secure escrow and released to the lender only after successful return of the item.',
    questionHi: 'मैं किराए के लिए payment कैसे करूं?',
    answerHi: 'आप UPI, Debit/Credit Card, या Net Banking से payment कर सकते हैं। Payment secure escrow में रहती है और item वापस करने के बाद ही lender को मिलती है।',
    category: 'payment',
    keywords: ['pay', 'payment', 'upi', 'card', 'net banking', 'escrow'],
  },
  {
    question: 'Is my payment secure on RentMate?',
    answer: 'Yes! All payments on RentMate are secured using an escrow system. Your money is only released to the lender after you confirm a safe return.',
    category: 'payment',
    keywords: ['secure', 'safe', 'payment', 'escrow', 'trust'],
  },
  {
    question: 'When will I get a refund if the lender cancels?',
    answer: 'If the lender cancels your rental request, you receive a full refund within 3–5 business days to your original payment method.',
    questionHi: 'अगर lender cancel करे तो refund कब मिलेगा?',
    answerHi: 'अगर lender आपकी request cancel करता है, तो 3–5 business days में full refund आपके original payment method पर आ जाएगा।',
    category: 'payment',
    keywords: ['refund', 'cancel', 'money back', 'lender cancel'],
  },
  // Return Policy FAQs
  {
    question: 'What is the return policy on RentMate?',
    answer: 'Items must be returned by the agreed end date. Late returns are charged an extra ₹X per day (set by the lender). Contact the lender in advance if you need an extension.',
    questionHi: 'RentMate पर return policy क्या है?',
    answerHi: 'Item को agreed end date तक return करना जरूरी है। Late return पर ₹X/day extra charge लगता है। Extension के लिए lender से पहले बात करें।',
    category: 'return_policy',
    keywords: ['return', 'return policy', 'late', 'extension', 'deadline'],
  },
  {
    question: 'Can I extend my rental period?',
    answer: 'Yes! Contact the lender through RentMate chat to request an extension. If agreed, update the rental dates in the app and pay the additional amount.',
    category: 'return_policy',
    keywords: ['extend', 'extension', 'longer', 'more days', 'renew'],
  },
  // Damage Policy FAQs
  {
    question: 'What happens if I damage a rented item?',
    answer: 'If an item is damaged, a portion or all of your security deposit may be deducted. RentMate mediates disputes. Always photograph the item before and after use.',
    questionHi: 'अगर मैं rented item damage कर दूं तो क्या होगा?',
    answerHi: 'Item damage होने पर security deposit से कुछ या पूरा amount काटा जा सकता है। RentMate disputes में मदद करता है। हमेशा item की photo लें use से पहले और बाद में।',
    category: 'damage_policy',
    keywords: ['damage', 'broken', 'damaged', 'penalty', 'security deposit', 'compensation'],
  },
  {
    question: 'What is the security deposit?',
    answer: 'A refundable security deposit is collected at rental time. It covers potential damage or late returns. It is fully refunded if the item is returned on time and in good condition.',
    category: 'damage_policy',
    keywords: ['security', 'deposit', 'refundable', 'caution'],
  },
  // Account FAQs
  {
    question: 'How do I reset my password?',
    answer: 'Go to the Login page → click "Forgot Password" → enter your registered email → check your inbox for a reset link (valid 15 minutes).',
    questionHi: 'Password reset कैसे करें?',
    answerHi: 'Login page पर जाएं → "Forgot Password" click करें → अपना registered email डालें → inbox में reset link check करें (15 minutes valid)।',
    category: 'account',
    keywords: ['password', 'reset', 'forgot', 'login', 'account access'],
  },
  {
    question: 'My account is suspended. What should I do?',
    answer: 'If your account is suspended, contact our support at support@rentmate.in with your registered email. We typically resolve issues within 24–48 hours.',
    category: 'account',
    keywords: ['suspended', 'banned', 'blocked', 'account issue', 'restricted'],
  },
  {
    question: 'How do I verify my student identity?',
    answer: 'Upload a photo of your student ID or college email verification. RentMate verifies within 24 hours. Verified accounts get a trust badge.',
    category: 'account',
    keywords: ['verify', 'student id', 'college email', 'verification', 'trust badge'],
  },
  // General / Renting FAQs
  {
    question: 'How does RentMate work?',
    answer: 'RentMate is a peer-to-peer rental platform for students. Browse items → send a rent request → confirm payment → pick up / receive → use → return. Simple!',
    questionHi: 'RentMate कैसे काम करता है?',
    answerHi: 'RentMate students के लिए peer-to-peer rental platform है। Items browse करें → rent request भेजें → payment confirm करें → item लें → use करें → return करें। Simple!',
    category: 'general',
    keywords: ['how it works', 'how does', 'what is rentmate', 'process', 'steps'],
  },
  {
    question: 'Is RentMate free to use?',
    answer: 'Browsing and requesting rentals is free. RentMate charges a small platform fee (5–10%) on completed transactions for maintenance and support.',
    category: 'general',
    keywords: ['free', 'cost', 'fee', 'charge', 'commission', 'platform fee'],
  },
  {
    question: 'What cities is RentMate available in?',
    answer: 'RentMate is currently active in Delhi, Mumbai, Bangalore, Pune, Hyderabad, Chennai, and Kolkata. More cities coming soon!',
    category: 'general',
    keywords: ['city', 'location', 'available', 'where', 'area', 'place'],
  },
  // Listing FAQs
  {
    question: 'How do I list an item for rent?',
    answer: 'Go to Dashboard → "List an Item" → Choose category → Upload 2–4 photos → Write description → Set price & availability → Publish. Your item goes live instantly!',
    questionHi: 'Item rent पर कैसे list करें?',
    answerHi: 'Dashboard → "List an Item" → Category चुनें → 2–4 photos upload करें → Description लिखें → Price & availability set करें → Publish करें। Item तुरंत live हो जाती है!',
    category: 'listing',
    keywords: ['list', 'upload', 'post', 'add item', 'earn', 'lend', 'listing'],
  },
  {
    question: 'What items can I list on RentMate?',
    answer: 'You can list: Books, Electronics (laptops, calculators, cameras), Furniture (chairs, tables, shelves), and Study Essentials (lab coats, drawing boards). Items must be in usable condition.',
    category: 'listing',
    keywords: ['what items', 'allowed', 'categories', 'products', 'eligible'],
  },
  {
    question: 'How do I set the right rental price?',
    answer: 'Research similar items on RentMate. A good rule: set daily price at 5–10% of item value. For books, ₹10–₹30/day is common. Electronics: ₹100–₹500/day.',
    category: 'listing',
    keywords: ['price', 'pricing', 'how much', 'rate', 'charge', 'rental price'],
  },
];

async function seedFAQs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await FAQ.deleteMany({});
    console.log('🗑️  Cleared existing FAQs');

    await FAQ.insertMany(faqs);
    console.log(`✅ Seeded ${faqs.length} FAQs successfully`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seedFAQs();
