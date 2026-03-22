require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Actually, listing models might not be straightforward in the simplified SDK snippet,
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + process.env.GEMINI_API_KEY);
    const data = await response.json();
    console.log('Available Models:', data.models.map(m => m.name));
  } catch (error) {
    console.error('Error:', error);
  }
}
listModels();
