import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';

interface Score { correct: number; total: number }

const SITE = 'https://dutchlearningtools.nl';

function track(method: string, page: string) {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  g?.('event', 'share', { method, page });
}

/**
 * Shown inside an exercise's result feedback: the running score plus an
 * actionable "Share your score" button (native share on mobile, copy-link +
 * social intents elsewhere), deep-linking to the current exercise.
 */
export function ShareScore({ score, title }: { score: Score; title?: string }) {
  const { pathname } = useLocation();
  const { lang } = useLanguage();
  const ui = useUI();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = `${SITE}${pathname}`;
  const topic = title ?? (lang === 'es' ? 'gramática neerlandesa' : 'Dutch grammar');
  const message = lang === 'es'
    ? `Saqué ${score.correct}/${score.total} en ${topic} en Dutch Learning Tools 🇳🇱 ¿Puedes superarlo?`
    : `I scored ${score.correct}/${score.total} on ${topic} at Dutch Learning Tools 🇳🇱 Can you beat it?`;
  const full = `${message} ${url}`;

  const onShare = async () => {
    const nav = navigator as Navigator & { share?: (d: { title?: string; text?: string; url?: string }) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title: 'Dutch Learning Tools', text: message, url });
        track('native', pathname);
      } catch { /* user cancelled */ }
      return;
    }
    setOpen((o) => !o);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      track('copy', pathname);
    } catch { /* ignore */ }
  };

  const intents = [
    { label: 'X', method: 'x', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}` },
    { label: 'WhatsApp', method: 'whatsapp', href: `https://wa.me/?text=${encodeURIComponent(full)}` },
    { label: 'LinkedIn', method: 'linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: 'Facebook', method: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ];

  // Only surface the share button at every-10-correct milestones (10, 20, 30…).
  const showShare = score.correct > 0 && score.correct % 10 === 0;

  return (
    <div className="score-share">
      <span className="score-summary">{ui.scoreLabel}: <strong>{score.correct} / {score.total}</strong></span>
      {showShare && (
        <div className="share-wrap">
          <button className="share-btn" onClick={onShare}>📣 {ui.shareBtn}</button>
          {open && (
            <>
              <button className="share-backdrop" aria-label="Close" onClick={() => setOpen(false)} />
              <div className="share-menu" role="menu">
                <button className="share-item" onClick={copy}>{copied ? ui.shareCopied : ui.shareCopy}</button>
                {intents.map((i) => (
                  <a
                    key={i.method}
                    className="share-item"
                    href={i.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { track(i.method, pathname); setOpen(false); }}
                  >
                    {i.label}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
