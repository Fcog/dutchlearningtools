import { useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export function TheoryPanel({ children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="theory-panel">
      <button
        className="theory-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="theory-toggle-label">📖 Theory</span>
        <span className={`theory-arrow${open ? ' open' : ''}`}>›</span>
      </button>
      {open && <div className="theory-content">{children}</div>}
    </div>
  );
}
