import { useEffect, useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';

const EXIT_MS = 180; // keep in sync with the .is-closing animation in animations.css

export default function Modal({ open, title, onClose, children, footer }) {
  // `mounted` stays true for a moment after `open` turns false so the exit animation can play.
  const [mounted, setMounted] = useState(open);

  // Remember what was on screen so the content doesn't vanish while the modal fades out
  // (callers often clear their state, e.g. setEditing(null), at the same moment they close it).
  const lastContent = useRef({ title, children, footer });
  if (open) lastContent.current = { title, children, footer };

  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }
    const timer = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [open]);

  if (!open && !mounted) return null;

  const closing = !open;
  const content = closing ? lastContent.current : { title, children, footer };

  return (
    <div
      className={`modal-overlay ${closing ? 'is-closing' : ''}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="modal-box" role="dialog" aria-modal="true" aria-label={content.title}>
        <div className="modal-head">
          <h3 style={{ margin: 0 }}>{content.title}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <FiX />
          </button>
        </div>
        <div className="modal-body">{content.children}</div>
        {content.footer && <div className="modal-foot">{content.footer}</div>}
      </div>
    </div>
  );
}
