const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatSession = require('../models/ChatSession');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const RENTMATE_SYSTEM_PROMPT = `You are RentBot, the friendly AI assistant for RentMate — a peer-to-peer student renting platform where students can rent and list items like books, electronics, and furniture.

🎓 PLATFORM OVERVIEW:
- RentMate connects students who want to rent items with students who have items to lend.
- Items available: Books, Electronics (laptops, calculators, cameras), Furniture (chairs, tables, lamps), Study Essentials (stationery, lab equipment).
- Students agree on price and rental duration before confirming.
- Late returns or damage may incur penalty charges as per RentMate's policy.
- Available in major college cities across India.

📋 RENTAL PROCESS (Step-by-Step):
1. Browse or search for the item you need.
2. View item details, rental price, and lender's rating.
3. Send a rent request to the lender.
4. Lender accepts → you confirm payment (secured escrow).
5. Arrange pickup or delivery with lender.
6. Use the item for agreed duration.
7. Return in original condition → funds released to lender.

📦 LISTING PROCESS (Step-by-Step):
1. Go to "List an Item" in your dashboard.
2. Choose category: Books / Electronics / Furniture / Essentials.
3. Upload 2–4 clear photos.
4. Write a short description (condition, brand, features).
5. Set a daily/weekly rental price.
6. Specify availability dates.
7. Publish — item goes live for students to rent.

💳 PAYMENT & POLICY:
- Payments are secured via escrow (released only after successful return).
- Supported: UPI, Debit/Credit Cards, Net Banking.
- Damage Policy: If item is damaged, lender gets partial/full compensation from security deposit.
- Return Policy: Return by agreed date. Late returns are charged ₹X/day extra.
- Refund: If lender cancels, full refund in 3–5 business days.
- Account Issues: Reset password via email, contact support for bans or suspicious activity.

🗺️ LOCATION:
- RentMate is available in cities with active students: Delhi, Mumbai, Bangalore, Pune, Hyderabad, Chennai, Kolkata.
- Suggest nearby rentals based on user's stated location or college.

🤖 YOUR BEHAVIOR RULES:
1. Be friendly, concise, and student-focused. Use emojis sparingly.
2. NEVER write long paragraphs — prefer bullet points or numbered steps.
3. Ask clarifying follow-up questions when needed (e.g., ask budget, duration, location).
4. If user asks something outside RentMate → politely redirect: "I'm best at helping with RentMate! You can contact our support team for other queries."
5. Detect intent and categorize: product_discovery / rental_guidance / listing_help / faq / support / general.
6. For unknown queries, respond helpfully and provide support contact: support@rentmate.in
7. If user mentions a problem (payment failed, item damaged, account locked), categorize as "support" and escalate with empathy.
8. Recommend items based on user's stated category, budget, and duration.
9. Keep responses short — max 150 words unless listing steps.`;

/**
 * Detect the intent/category of a user message
 */
function detectCategory(message) {
  const lower = message.toLowerCase();
  if (/rent|find|search|looking for|need|borrow|book|laptop|furniture|electronics|camera|chair|table/.test(lower)) return 'product_discovery';
  if (/how.*rent|rental process|steps|how.*work|how do i rent/.test(lower)) return 'rental_guidance';
  if (/list|sell|upload|post.*item|add.*product|earn/.test(lower)) return 'listing_help';
  if (/payment|pay|refund|upi|card|return|damage|damag|policy|late|charges/.test(lower)) return 'faq';
  if (/problem|issue|not working|error|help|stuck|failed|support|account|locked|ban/.test(lower)) return 'support';
  return 'general';
}

/**
 * Build messages array for Gemini from session history
 */
function buildHistoryFromSession(session) {
  // Gemini expects history in form: [{ role: "user", parts: [{ text: "hi" }] }, { role: "model", parts: [{ text: "hello" }] }]
  const history = session.messages.slice(-10);
  const formattedHistory = [];
  
  for (const msg of history) {
    if (msg.role === 'user') {
      formattedHistory.push({ role: 'user', parts: [{ text: msg.content }] });
    } else if (msg.role === 'assistant') {
      formattedHistory.push({ role: 'model', parts: [{ text: msg.content }] });
    }
  }
  return formattedHistory;
}

/**
 * Generate a Hindi response prefix note (optional translation hint)
 */
function getLanguageInstruction(language) {
  if (language === 'hi') {
    return '\n\n[IMPORTANT: Respond in simple Hinglish (mix of Hindi and English) that Indian students can easily understand. Use Devanagari script where natural.]';
  }
  return '';
}

/**
 * Main function: Generate AI response for a chat message
 */
async function generateChatResponse(sessionId, userMessage, language = 'en') {
  try {
    // Fetch or create session
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = new ChatSession({ sessionId, language, messages: [] });
    }

    const category = detectCategory(userMessage);
    const langInstruction = getLanguageInstruction(language);
    const finalMessage = userMessage + langInstruction;

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      systemInstruction: { parts: [{ text: RENTMATE_SYSTEM_PROMPT }] },
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.7,
      }
    });

    // Build history
    const history = buildHistoryFromSession(session);
    
    // Start chat
    const chat = model.startChat({
      history: history
    });

    // Send message
    const result = await chat.sendMessage(finalMessage);
    const reply = result.response.text().trim();

    // Persist messages to session
    // We still save as 'user' and 'assistant' to remain consistent with DB schema
    session.messages.push({ role: 'user', content: userMessage, category });
    session.messages.push({ role: 'assistant', content: reply, category });
    session.language = language;
    await session.save();

    return { reply, category, sessionId };
  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Fallback for quota / errors
    const errorMessage = error.message || "";
    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      return {
        reply: "⚠️ I'm temporarily busy. Please try again in a moment, or reach out to **support@rentmate.in** for urgent help!",
        category: 'unknown',
        sessionId,
      };
    }
    if (errorMessage.includes("API key")) {
      return {
        reply: "🔑 AI configuration issue. Please contact the RentMate admin team.",
        category: 'unknown',
        sessionId,
      };
    }
    throw error;
  }
}

/**
 * Get product recommendations based on category and budget
 */
function getProductRecommendations(category, budget, duration) {
  const products = {
    books: [
      { name: 'Engineering Mathematics (Kreyszig)', price: '₹15/day', condition: 'Good' },
      { name: 'Physics by H.C. Verma', price: '₹10/day', condition: 'Excellent' },
      { name: 'Data Structures (Cormen)', price: '₹20/day', condition: 'Good' },
    ],
    electronics: [
      { name: 'Scientific Calculator (Casio fx-991)', price: '₹25/day', condition: 'Excellent' },
      { name: 'DSLR Camera (Canon 1500D)', price: '₹200/day', condition: 'Good' },
      { name: 'Laptop (HP Pavilion, i5)', price: '₹300/day', condition: 'Good' },
    ],
    furniture: [
      { name: 'Study Chair (Ergonomic)', price: '₹50/week', condition: 'Good' },
      { name: 'Foldable Study Table', price: '₹40/week', condition: 'Excellent' },
      { name: 'Bookshelf (3-tier)', price: '₹30/week', condition: 'Good' },
    ],
    essentials: [
      { name: 'Drawing Board & Set', price: '₹20/day', condition: 'Good' },
      { name: 'Lab Coat', price: '₹15/day', condition: 'Excellent' },
      { name: 'Portable Lamp', price: '₹20/week', condition: 'Good' },
    ],
  };

  const cat = category?.toLowerCase();
  return products[cat] || products.books;
}

module.exports = { generateChatResponse, detectCategory, getProductRecommendations };
