import ChatMessage from '../ChatMessage/ChatMessage';
import QuickReplies from '../QuickReplies/QuickReplies';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import ChatInput from '../ChatInput/ChatInput';
import { t } from '../../utils/i18n';
import './ChatWindow.css';

export default function ChatWindow({
  messages,
  isLoading,
  language,
  showQuickReplies,
  messagesEndRef,
  handleSend,
  clearChat,
  toggleLanguage,
  toggleChat,
}) {
  return (
    <div className="chat-window" role="dialog" aria-label="RentMate Chat">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <div className="bot-avatar">
            <span>🤖</span>
            <span className="status-dot" />
          </div>
          <div className="header-info">
            <h3 className="header-title">{t(language, 'chatTitle')}</h3>
            <p className="header-subtitle">
              <span className="online-dot" />
              {t(language, 'online')} · {t(language, 'poweredBy')}
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="header-btn lang-btn"
            onClick={toggleLanguage}
            title="Switch language"
          >
            {t(language, 'langToggle')}
          </button>
          <button
            className="header-btn"
            onClick={clearChat}
            title={t(language, 'clearChat')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
          <button className="header-btn close-btn" onClick={toggleChat} title="Close chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" id="chat-messages-list">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} language={language} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {showQuickReplies && messages.length > 0 && (
        <QuickReplies language={language} onSelect={handleSend} />
      )}

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        isLoading={isLoading}
        language={language}
      />
    </div>
  );
}
