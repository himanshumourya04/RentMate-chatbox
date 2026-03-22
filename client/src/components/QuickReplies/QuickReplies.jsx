import { t } from '../../utils/i18n';
import './QuickReplies.css';

export default function QuickReplies({ language, onSelect }) {
  const replies = t(language, 'quickReplies');

  return (
    <div className="quick-replies-wrap">
      <p className="quick-label">Quick Actions</p>
      <div className="quick-replies-list">
        {replies.map((reply) => (
          <button
            key={reply.id}
            className="quick-reply-btn"
            onClick={() => onSelect(reply.message)}
            type="button"
            id={`quick-reply-${reply.id}`}
          >
            {reply.label}
          </button>
        ))}
      </div>
    </div>
  );
}
