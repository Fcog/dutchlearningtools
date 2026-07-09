import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../i18n/ui';
import { AuthModal } from './AuthModal';

interface Score {
  correct: number;
  total: number;
}

interface Props {
  backTo?: string;
  score?: Score;
  title?: string;
}

function userInitials(email: string): string {
  return email.slice(0, 2).toUpperCase();
}

export function Header({ backTo, title }: Props) {
  const { lang, setLang } = useLanguage();
  const { user, signOut } = useAuth();
  const ui = useUI();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            {backTo ? (
              <Link to={backTo} className="back-btn" aria-label={ui.back}>
                ←
              </Link>
            ) : null}
            <img src={logo} alt="Dutch Learning Tools" className="logo-img" />
            <h1>{title ?? ui.learnDutch}</h1>
          </div>
          <div className="header-right">
            <div className="lang-switcher">
              <button
                className={`lang-btn${lang === 'en' ? ' active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                className={`lang-btn${lang === 'es' ? ' active' : ''}`}
                onClick={() => setLang('es')}
              >
                ES
              </button>
            </div>
            {user ? (
              <div className="user-menu">
                <Link to="/account" className="user-avatar" title={ui.accountTitle}>
                  {userInitials(user.email ?? '?')}
                </Link>
                <button className="signout-btn" onClick={signOut}>
                  Sign out
                </button>
              </div>
            ) : (
              <button className="signin-btn" onClick={() => setAuthOpen(true)}>
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
