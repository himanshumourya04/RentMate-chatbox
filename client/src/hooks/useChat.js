import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage } from '../services/chatApi';
import { t } from '../utils/i18n';

function getOrCreateSessionId() {
  let id = sessionStorage.getItem('rentmate_session');
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem('rentmate_session', id);
  }
  return id;
}

export function useChat() {
  const sessionId = useRef(getOrCreateSessionId()).current;
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Inject welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = {
        id: uuidv4(),
        role: 'assistant',
        content: t(language, 'welcomeMessage'),
        timestamp: new Date().toISOString(),
      };
      setMessages([welcome]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clear unread when window opens
  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSend = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setShowQuickReplies(false);

      const userMsg = {
        id: uuidv4(),
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const data = await sendMessage(sessionId, trimmed, language);
        const botMsg = {
          id: uuidv4(),
          role: 'assistant',
          content: data.reply,
          category: data.category,
          timestamp: data.timestamp,
        };
        setMessages((prev) => [...prev, botMsg]);
        if (!isOpen) setUnreadCount((c) => c + 1);
      } catch (err) {
        const errorMsg = {
          id: uuidv4(),
          role: 'assistant',
          content: t(language, 'errorMessage'),
          timestamp: new Date().toISOString(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, language, isLoading, isOpen]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setShowQuickReplies(true);
    sessionStorage.removeItem('rentmate_session');
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  return {
    messages,
    isLoading,
    isOpen,
    language,
    showQuickReplies,
    unreadCount,
    messagesEndRef,
    handleSend,
    toggleChat,
    clearChat,
    toggleLanguage,
    sessionId,
  };
}
