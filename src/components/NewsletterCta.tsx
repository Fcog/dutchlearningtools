import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SESSION_KEY = 'nl_cta_dismissed';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Homepage newsletter call-to-action. Shows once per browser session (dismiss or
 * a successful sign-up hides it for the session). Includes a validated email
 * input and a hidden honeypot field; the real anti-abuse (rate limiting, double
 * opt-in) lives in the newsletter-subscribe Edge Function.
 */
export function NewsletterCta() {
  const { lang } = useLanguage();
  const ui = useUI();
  const [hidden, setHidden] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
  });
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot — real users leave it empty
  const [status, setStatus] = useState<Status>('idle');
  const [msg, setMsg] = useState('');

  if (hidden) return null;

  const dismiss = () => {
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
    setHidden(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) { setStatus('error'); setMsg(ui.ctaInvalidEmail); return; }
    setStatus('submitting');
    setMsg('');
    const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
      body: { email: email.trim(), lang, website },
    });
    const res = data as { ok?: boolean; error?: string } | null;
    if (error || !res?.ok) {
      setStatus('error');
      setMsg(res?.error === 'rate-limited' ? ui.ctaRateLimited : ui.ctaError);
      return;
    }
    setStatus('success');
    setMsg(ui.ctaSuccess);
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
  };

  return (
    <div className="nl-cta">
      <button className="nl-cta-close" onClick={dismiss} aria-label={ui.ctaClose}>✕</button>
      {status === 'success' ? (
        <p className="nl-cta-success">✅ {msg}</p>
      ) : (
        <>
          <div className="nl-cta-text">
            <span className="nl-cta-title">📬 {ui.ctaTitle}</span>
            <span className="nl-cta-sub">{ui.ctaText}</span>
          </div>
          <form className="nl-cta-form" onSubmit={submit} noValidate>
            {/* Honeypot: visually hidden, off the tab order; bots fill it, humans don't. */}
            <input
              type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
              className="nl-cta-hp" value={website} onChange={(e) => setWebsite(e.target.value)}
            />
            <input
              type="email" required placeholder={ui.ctaEmailPlaceholder} value={email}
              onChange={(e) => setEmail(e.target.value)} disabled={status === 'submitting'}
              className="nl-cta-input" autoComplete="email"
            />
            <button type="submit" className="nl-cta-btn" disabled={status === 'submitting'}>
              {status === 'submitting' ? '…' : ui.ctaSubscribe}
            </button>
          </form>
          {status === 'error' && <p className="nl-cta-error">{msg}</p>}
        </>
      )}
    </div>
  );
}
