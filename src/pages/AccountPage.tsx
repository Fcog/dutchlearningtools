import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { useNewsletter } from '../hooks/useNewsletter';
import { supabase } from '../lib/supabase';
import type { SupportedLang } from '../types';

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { lang } = useLanguage();
  const ui = useUI();
  const { getSubscription, saveSubscription } = useNewsletter();
  const navigate = useNavigate();

  const [optedIn, setOptedIn] = useState(false);
  const [prefLang, setPrefLang] = useState<SupportedLang>(lang);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!user) { setLoaded(true); return; }
    let active = true;
    getSubscription().then((sub) => {
      if (!active) return;
      if (sub) { setOptedIn(sub.opted_in); setPrefLang(sub.lang); }
      setLoaded(true);
    });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const save = async (nextOptedIn: boolean, nextLang: SupportedLang) => {
    setSaving(true);
    setSaved(false);
    const { error } = await saveSubscription(nextOptedIn, nextLang);
    setSaving(false);
    if (!error) { setSaved(true); window.setTimeout(() => setSaved(false), 2500); }
  };

  const toggle = () => { const v = !optedIn; setOptedIn(v); save(v, prefLang); };
  const changeLang = (l: SupportedLang) => { setPrefLang(l); if (optedIn) save(optedIn, l); };

  const deleteAccount = async () => {
    setDeleting(true);
    setDeleteError('');
    const { data, error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
    if (error || !(data as { ok?: boolean } | null)?.ok) {
      setDeleting(false);
      setDeleteError(ui.deleteError);
      return;
    }
    // Account is gone — clear the local session and leave.
    await signOut();
    navigate('/');
  };

  return (
    <div className="app">
      <Header backTo="/" title={ui.accountTitle} />
      <main className="main">
        <div className="account-panel">
          <h2 className="account-heading">{ui.accountTitle}</h2>

          {authLoading ? null : !user ? (
            <p className="account-note">{ui.accountSignInPrompt}</p>
          ) : (
            <>
              <p className="account-email">{user.email}</p>

              <div className="account-card">
                <div className="account-row">
                  <div>
                    <div className="account-row-title">{ui.newsletterTitle}</div>
                    <div className="account-row-desc">{ui.newsletterDesc}</div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={optedIn}
                    className={`toggle${optedIn ? ' on' : ''}`}
                    onClick={toggle}
                    disabled={!loaded || saving}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>

                {optedIn && (
                  <div className="account-row">
                    <div className="account-row-title">{ui.newsletterLangLabel}</div>
                    <div className="lang-switcher">
                      <button className={`lang-btn${prefLang === 'en' ? ' active' : ''}`} onClick={() => changeLang('en')}>EN</button>
                      <button className={`lang-btn${prefLang === 'es' ? ' active' : ''}`} onClick={() => changeLang('es')}>ES</button>
                    </div>
                  </div>
                )}
              </div>

              <p className="account-status">
                {saving ? ui.saving : saved ? ui.saved : optedIn ? ui.newsletterOn : ui.newsletterOff}
              </p>

              <div className="danger-zone">
                <div className="account-row-title">{ui.deleteAccount}</div>
                <div className="account-row-desc">{ui.deleteAccountDesc}</div>
                <button className="danger-btn" onClick={() => { setDeleteError(''); setConfirmOpen(true); }}>
                  {ui.deleteAccount}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />

      {confirmOpen && (
        <div className="auth-modal-overlay" onClick={() => !deleting && setConfirmOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="auth-modal-heading">{ui.deleteConfirmTitle}</h3>
            <p className="auth-modal-sub">{ui.deleteConfirmBody}</p>
            {deleteError && <p className="account-status" style={{ color: 'var(--error)' }}>{deleteError}</p>}
            <div className="danger-modal-actions">
              <button className="hint-btn" onClick={() => setConfirmOpen(false)} disabled={deleting}>
                {ui.cancel}
              </button>
              <button className="danger-btn" onClick={deleteAccount} disabled={deleting}>
                {deleting ? ui.deleting : ui.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
