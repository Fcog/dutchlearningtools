import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';
import { useUI } from '../i18n/ui';

type State = 'working' | 'done' | 'notfound' | 'error';

export default function ConfirmNewsletterPage() {
  const [params] = useSearchParams();
  const ui = useUI();
  const [state, setState] = useState<State>('working');
  const token = params.get('token');

  useEffect(() => {
    if (!token) { setState('error'); return; }
    let active = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .rpc('confirm_newsletter_signup', { p_token: token })
      .then(({ data, error }: { data: boolean | null; error: unknown }) => {
        if (!active) return;
        if (error) setState('error');
        else setState(data ? 'done' : 'notfound');
      });
    return () => { active = false; };
  }, [token]);

  const message = {
    working: ui.confirmWorking,
    done: ui.confirmDone,
    notfound: ui.confirmNotFound,
    error: ui.confirmError,
  }[state];

  return (
    <div className="app">
      <Header backTo="/" title={ui.confirmTitle} />
      <main className="main">
        <div className="account-panel">
          <h2 className="account-heading">{ui.confirmTitle}</h2>
          <p className="account-note">{message}</p>
          <Link to="/" className="next-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
            {ui.back} →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
