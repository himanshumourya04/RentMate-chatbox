import { useState, useRef } from 'react';
import { t } from '../../utils/i18n';
import './ChatInput.css';

export default function ChatInput({ onSend, isLoading, language }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value);
      setValue('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <div className="chat-input-wrap">
        <input
          ref={inputRef}
          id="chat-input-field"
          type="text"
          className="chat-input"
          placeholder={isLoading ? t(language, 'sending') : t(language, 'inputPlaceholder')}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoComplete="off"
          maxLength={1000}
        />
        <button
          id="chat-send-btn"
          type="submit"
          className={`chat-send-btn ${isLoading ? 'loading' : ''} ${value.trim() ? 'active' : ''}`}
          disabled={isLoading || !value.trim()}
          aria-label="Send message"
        >
          {isLoading ? (
            <svg className="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          )}
        </button>
      </div>
      <p className="input-hint">Enter to send · RentMate AI</p>
    </form>
  );
}
