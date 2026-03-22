import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Send a chat message to the backend
 */
export async function sendMessage(sessionId, message, language = 'en') {
  const response = await api.post('/api/chat', { sessionId, message, language });
  return response.data;
}

/**
 * Get chat session history
 */
export async function getSessionHistory(sessionId) {
  const response = await api.get(`/api/chat/${sessionId}`);
  return response.data;
}

/**
 * Get FAQs (with optional category filter)
 */
export async function getFAQs(category = null, lang = 'en') {
  const params = { lang };
  if (category) params.category = category;
  const response = await api.get('/api/faqs', { params });
  return response.data;
}

/**
 * Get analytics data
 */
export async function getAnalytics() {
  const response = await api.get('/api/analytics');
  return response.data;
}

export default api;
