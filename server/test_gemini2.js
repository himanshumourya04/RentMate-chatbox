require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Return the word ALIVE.');
    console.log('SUCCESS_TESTING_KEY');
  } catch (error) {
    console.error('ERROR_TESTING_KEY:', error.message);
  }
}
test();
