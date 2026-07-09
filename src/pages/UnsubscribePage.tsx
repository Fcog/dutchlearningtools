import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';
import { track } from '../lib/analytics';
import { useUI } from '../i18n/ui';

type State = 'working' | 'done' | 'notfound' | 'error';

export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const ui = useUI();
  const [state, setState] = useState<State>('working');
  const token = params.get('token');

  useEffect(() => {
    if (!token) { setState('error'); return; }
    let active = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .rpc('unsubscribe_newsletter', { p_token: token })
      .then(({ data, error }: { data: boolean | null; error: unknown }) => {
        if (!active) return;
        if (error) setState('error');
        else if (data) { setState('done'); track('newsletter_unsubscribe', { source: 'email' }); }
        else setState('notfound');
      });
    return () => { active = false; };
  }, [token]);

  const message = {
    working: ui.unsubWorking,
    done: ui.unsubDone,
    notfound: ui.unsubNotFound,
    error: ui.unsubError,
  }[state];

  return (
    <div className="app">
      <Header backTo="/" title={ui.unsubTitle} />
      <main className="main">
        <div className="account-panel">
          <h2 className="account-heading">{ui.unsubTitle}</h2>
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
