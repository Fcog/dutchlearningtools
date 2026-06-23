import { useState } from 'react';
import { useUI } from '../i18n/ui';

interface Props {
  children: React.ReactNode;
}

export function TheoryPanel({ children }: Props) {
  const [open, setOpen] = useState(false);
  const ui = useUI();

  return (
    <div className="theory-panel">
      <button
        className="theory-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="theory-toggle-label">{ui.theory}</span>
        <span className={`theory-arrow${open ? ' open' : ''}`}>›</span>
      </button>
      {open && <div className="theory-content">{children}</div>}
    </div>
  );
}
