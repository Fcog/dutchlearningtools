import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'signin' | 'signup';

export function AuthModal({ isOpen, onClose }: Props) {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Close when user signs in
  useEffect(() => {
    if (user && isOpen) onClose();
  }, [user, isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError('');
      setMessage('');
      setTab('signin');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    if (tab === 'signin') {
      const { error } = await signInWithEmail(email, password);
      if (error) setError(error.message);
    } else {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email to confirm your account.');
      }
    }

    setSubmitting(false);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="auth-tabs">
          <button
            className={`auth-tab${tab === 'signin' ? ' active' : ''}`}
            onClick={() => { setTab('signin'); setError(''); setMessage(''); }}
          >
            Sign in
          </button>
          <button
            className={`auth-tab${tab === 'signup' ? ' active' : ''}`}
            onClick={() => { setTab('signup'); setError(''); setMessage(''); }}
          >
            Create account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Email
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="auth-label">
            Password
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
              required
              minLength={6}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-message">{message}</p>}

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? '…' : tab === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="auth-google" onClick={signInWithGoogle}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
