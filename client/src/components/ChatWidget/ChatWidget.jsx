import { useChat } from '../../hooks/useChat';
import ChatWindow from '../ChatWindow/ChatWindow';
import './ChatWidget.css';

export default function ChatWidget() {
  const chatState = useChat();
  const { isOpen, toggleChat, unreadCount } = chatState;

  return (
    <div className="chat-widget">
      {/* Chat Window */}
      {isOpen && <ChatWindow {...chatState} />}

      {/* Toggle Button */}
      <button
        className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle chat"
        title="Chat with RentBot"
      >
        {/* Pulse rings */}
        {!isOpen && <span className="pulse-ring ring-1" />}
        {!isOpen && <span className="pulse-ring ring-2" />}

        {/* Icon */}
        <span className="toggle-icon">
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
        </span>

        {/* Unread badge */}
        {unreadCount > 0 && !isOpen && (
          <span className="unread-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>
    </div>
  );
}
