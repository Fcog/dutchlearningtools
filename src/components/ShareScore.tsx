import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { track } from '../lib/analytics';

interface Score { correct: number; total: number }

const SITE = 'https://dutchlearningtools.nl';

/**
 * Result-feedback footer: the running score on the left, and (right-aligned)
 * any extra control, a lean Share button, and the Next button on one row.
 * The share button only appears at every-10-correct milestones.
 */
export function ShareScore({ score, title, onNext, extra }: {
  score: Score;
  title?: string;
  onNext?: () => void;
  extra?: ReactNode;
}) {
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
        track('share', { method: 'native', page: pathname });
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
      track('share', { method: 'copy', page: pathname });
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
    <div className="result-footer">
      <span className="score-summary">{ui.scoreLabel}: <strong>{score.correct} / {score.total}</strong></span>
      <div className="result-footer-actions">
        {extra}
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
                      onClick={() => { track('share', { method: i.method, page: pathname }); setOpen(false); }}
                    >
                      {i.label}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        {onNext && <button className="next-btn" onClick={onNext}>{ui.next}</button>}
      </div>
    </div>
  );
}
