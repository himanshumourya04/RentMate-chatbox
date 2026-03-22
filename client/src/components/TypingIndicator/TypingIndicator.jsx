import './TypingIndicator.css';

export default function TypingIndicator() {
  return (
    <div className="typing-wrap">
      <div className="typing-avatar">🤖</div>
      <div className="typing-bubble">
        <span className="dot dot1" />
        <span className="dot dot2" />
        <span className="dot dot3" />
      </div>
    </div>
  );
}
