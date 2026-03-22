export const strings = {
  en: {
    chatTitle: 'RentBot',
    chatSubtitle: 'Your RentMate Assistant',
    inputPlaceholder: 'Type a message...',
    quickReplies: [
      { id: 'find', label: '🔍 Find Product', message: 'I need to find a product to rent' },
      { id: 'how', label: '📋 How it Works', message: 'How does RentMate work?' },
      { id: 'list', label: '📦 List Item', message: 'I want to list my item for rent' },
      { id: 'support', label: '🆘 Support', message: 'I need help with an issue' },
    ],
    welcomeMessage:
      "👋 Hi! I'm **RentBot**, your RentMate assistant!\n\nI can help you:\n• 🔍 Find products to rent\n• 📋 Understand how renting works\n• 📦 List your items\n• 💳 Answer payment & policy questions\n\nWhat can I help you with today?",
    sending: 'Sending...',
    online: 'Online',
    poweredBy: 'Powered by AI',
    errorMessage: "⚠️ Something went wrong. Please try again or contact **support@rentmate.in**.",
    clearChat: 'Clear Chat',
    langToggle: 'हिंदी',
  },
  hi: {
    chatTitle: 'रेंटबॉट',
    chatSubtitle: 'आपका RentMate सहायक',
    inputPlaceholder: 'कुछ लिखें...',
    quickReplies: [
      { id: 'find', label: '🔍 Product खोजें', message: 'मुझे कोई product rent करना है' },
      { id: 'how', label: '📋 कैसे काम करता है', message: 'RentMate कैसे काम करता है?' },
      { id: 'list', label: '📦 Item List करें', message: 'मैं अपना item rent पर देना चाहता हूं' },
      { id: 'support', label: '🆘 Help चाहिए', message: 'मुझे किसी समस्या में help चाहिए' },
    ],
    welcomeMessage:
      "👋 नमस्ते! मैं **रेंटबॉट** हूं, आपका RentMate सहायक!\n\nमैं आपकी मदद कर सकता हूं:\n• 🔍 Rent के लिए products खोजने में\n• 📋 Renting process समझने में\n• 📦 अपने items list करने में\n• 💳 Payment & policy के सवालों में\n\nआज मैं आपकी कैसे मदद कर सकता हूं?",
    sending: 'भेज रहा है...',
    online: 'ऑनलाइन',
    poweredBy: 'AI द्वारा संचालित',
    errorMessage: "⚠️ कुछ गड़बड़ हुई। फिर से कोशिश करें या **support@rentmate.in** से संपर्क करें।",
    clearChat: 'Chat साफ़ करें',
    langToggle: 'English',
  },
};

export function t(language, key) {
  return strings[language]?.[key] ?? strings.en[key];
}
