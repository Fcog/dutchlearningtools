import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VerbsPage from './pages/VerbsPage';
import PositionalVerbsPage from './pages/PositionalVerbsPage';
import SeparableVerbsPage from './pages/SeparableVerbsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ArticlesPage from './pages/ArticlesPage';
import PluralsPage from './pages/PluralsPage';
import WordOrderPage from './pages/WordOrderPage';

declare global {
  function gtag(...args: unknown[]): void;
}

function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    if (typeof gtag === 'undefined') return;
    gtag('event', 'page_view', {
      page_path: location.pathname,
    });
  }, [location.pathname]);
}

export default function App() {
  usePageTracking();
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/verbs-conjugation" element={<VerbsPage />} />
      <Route path="/positional-verbs" element={<PositionalVerbsPage />} />
      <Route path="/separable-verbs" element={<SeparableVerbsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-use" element={<TermsOfUsePage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/plurals" element={<PluralsPage />} />
      <Route path="/word-order" element={<WordOrderPage />} />
    </Routes>
  );
}
