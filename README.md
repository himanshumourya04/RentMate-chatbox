# 🎓 RentMate AI Chatbot

A full-stack MERN AI chatbot for **RentMate** — a student-to-student product renting platform. Built with React + Vite (frontend), Node.js + Express (backend), MongoDB, and OpenAI GPT.

---

## 📁 Project Structure
```
chatbot/
├── server/      # Node.js + Express API
└── client/      # React + Vite frontend
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- OpenAI API Key

### 2. Backend Setup
```bash
cd server
# Add your OpenAI API key and MongoDB URI
cp .env.example .env
# Edit .env and set OPENAI_API_KEY=your_key_here

npm install
npm run seed      # Seed FAQs into MongoDB (optional)
npm start         # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
cp .env.example .env
npm install
npm run dev       # Runs on http://localhost:5173
```

---

## 🔑 Environment Variables

### `server/.env`
| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/rentmate` |
| `OPENAI_API_KEY` | Your OpenAI API key | *(required)* |
| `OPENAI_MODEL` | Model to use | `gpt-3.5-turbo` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `RATE_LIMIT_MAX` | Max requests per window | `30` |

### `client/.env`
| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000` |

---

## 🤖 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/chat` | Send chat message |
| `GET` | `/api/chat/:sessionId` | Get session history |
| `GET` | `/api/faqs` | List FAQs |
| `GET` | `/api/analytics` | Query analytics |

### Chat Request Body
```json
{
  "sessionId": "uuid-string",
  "message": "I need to rent a laptop",
  "language": "en"
}
```

---

## ✨ Features
- 🤖 OpenAI GPT-powered NLU with RentMate context
- 🧠 Session memory (last 10 messages)
- 🌐 English + Hindi (Hinglish) support
- 📊 Query analytics & category tracking
- 🛡️ Rate limiting, input validation, helmet security
- 📦 MongoDB persistence (sessions, FAQs, analytics)
- 🎨 Modern dark UI with animations
- 📱 Mobile responsive

---

## 🚀 Deployment

- **Frontend**: Deploy `client/` to [Vercel](https://vercel.com) — set `VITE_API_BASE_URL` in Vercel env vars
- **Backend**: Deploy `server/` to Railway, Render, or any Node.js host — set all `.env` variables

---

## 📧 Support
Contact: support@rentmate.in
