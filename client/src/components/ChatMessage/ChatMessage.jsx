import './ChatMessage.css';

// Simple markdown-like formatting: **bold**, bullet points, numbered lists
function formatContent(text) {
  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  for (const line of lines) {
    if (!line.trim()) { elements.push(<br key={key++} />); continue; }

    // Bold + replace **text**
    const formatted = line.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (/^•\s/.test(line) || /^-\s/.test(line)) {
      elements.push(<div key={key++} className="msg-bullet">• {formatted.slice(1)}</div>);
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(<div key={key++} className="msg-numbered">{formatted}</div>);
    } else {
      elements.push(<p key={key++} className="msg-para">{formatted}</p>);
    }
  }
  return elements;
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

const categoryLabels = {
  product_discovery: '🔍 Product',
  rental_guidance: '📋 Rental',
  listing_help: '📦 Listing',
  faq: '❓ FAQ',
  support: '🆘 Support',
  general: null,
  unknown: null,
};

export default function ChatMessage({ message }) {
  const isBot = message.role === 'assistant';
  const label = categoryLabels[message.category];

  return (
    <div className={`chat-msg ${isBot ? 'bot' : 'user'} ${message.isError ? 'error' : ''}`}>
      {isBot && (
        <div className="msg-avatar">
          <span>🤖</span>
        </div>
      )}
      <div className="msg-bubble-wrap">
        {isBot && label && <span className="msg-category-tag">{label}</span>}
        <div className="msg-bubble">
          <div className="msg-content">{formatContent(message.content)}</div>
        </div>
        <span className="msg-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}
