import './App.css';
import ChatWidget from './components/ChatWidget/ChatWidget';

function App() {
  return (
    <div className="app">
      {/* Demo background for the showcase page */}
      <div className="demo-hero">
        <div className="demo-badge">🎓 Student Renting Platform</div>
        <h1 className="demo-title">
          Welcome to <span className="gradient-text">RentMate</span>
        </h1>
        <p className="demo-subtitle">
          Rent books, electronics &amp; furniture from fellow students.<br />
          Fast, affordable, and trusted.
        </p>
        <div className="demo-stats">
          <div className="stat"><span>2,400+</span><label>Items Listed</label></div>
          <div className="stat"><span>8,100+</span><label>Students</label></div>
          <div className="stat"><span>4.9★</span><label>Avg Rating</label></div>
        </div>
        <p className="demo-hint">
          👇 Try the AI chatbot in the bottom-right corner!
        </p>
      </div>
      {/* AI Chatbot Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
