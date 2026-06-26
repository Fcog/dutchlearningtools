import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

type PageState = 'loading' | 'form' | 'success' | 'invalid';

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when the user lands with a valid recovery token.
    // getSession() checks whether we already have a session from the URL hash.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setPageState('form');
      } else {
        setPageState('invalid');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setPageState('form');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const { error } = await updatePassword(password);

    if (error) {
      setError(error.message);
      setSubmitting(false);
    } else {
      setPageState('success');
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main policy-main">
        {pageState === 'loading' && (
          <p className="auth-modal-sub">Verifying your reset link…</p>
        )}

        {pageState === 'invalid' && (
          <div className="reset-card">
            <h2 className="policy-title">Invalid or expired link</h2>
            <p className="auth-modal-sub">
              This password reset link is invalid or has already been used.
              Please request a new one from the sign-in screen.
            </p>
            <button className="auth-submit" onClick={() => navigate('/')}>
              Go to home
            </button>
          </div>
        )}

        {pageState === 'form' && (
          <div className="reset-card">
            <h2 className="policy-title">Set new password</h2>
            <p className="auth-modal-sub">Choose a strong password for your account.</p>
            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-label">
                New password
                <input
                  className="auth-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </label>
              <label className="auth-label">
                Confirm password
                <input
                  className="auth-input"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </label>

              {error && <p className="auth-error">{error}</p>}

              <button className="auth-submit" type="submit" disabled={submitting}>
                {submitting ? '…' : 'Update password'}
              </button>
            </form>
          </div>
        )}

        {pageState === 'success' && (
          <div className="reset-card">
            <h2 className="policy-title">Password updated</h2>
            <p className="auth-modal-sub">
              Your password has been changed successfully. You are now signed in.
            </p>
            <button className="auth-submit" onClick={() => navigate('/')}>
              Go to home
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
