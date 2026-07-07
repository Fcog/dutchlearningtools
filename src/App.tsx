import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VerbsPage from './pages/VerbsPage';
import PositionalVerbsPage from './pages/PositionalVerbsPage';
import DirectionalAdverbsPage from './pages/DirectionalAdverbsPage';
import FromToPage from './pages/FromToPage';
import SeparableVerbsPage from './pages/SeparableVerbsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ArticlesPage from './pages/ArticlesPage';
import PluralsPage from './pages/PluralsPage';
import WordOrderPage from './pages/WordOrderPage';
import VoorstellenPage from './pages/VoorstellenPage';
import NegationPage from './pages/NegationPage';
import PrepositionsPage from './pages/PrepositionsPage';
import TimePrepositionsPage from './pages/TimePrepositionsPage';
import MixPage from './pages/MixPage';
import ExpressionsPage from './pages/ExpressionsPage';
import AdjectivesHubPage from './pages/AdjectivesHubPage';
import AdjectivesExercisePage from './pages/AdjectivesExercisePage';
import AccountPage from './pages/AccountPage';
import SingleExercisePage from './pages/SingleExercisePage';
import UnsubscribePage from './pages/UnsubscribePage';

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
      <Route path="/directional-adverbs" element={<DirectionalAdverbsPage />} />
      <Route path="/from-to" element={<FromToPage />} />
      <Route path="/separable-verbs" element={<SeparableVerbsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-use" element={<TermsOfUsePage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/plurals" element={<PluralsPage />} />
      <Route path="/word-order" element={<WordOrderPage />} />
      <Route path="/voorstellen" element={<VoorstellenPage />} />
      <Route path="/negation" element={<NegationPage />} />
      <Route path="/prepositions" element={<PrepositionsPage />} />
      <Route path="/time-prepositions" element={<TimePrepositionsPage />} />
      <Route path="/expressions" element={<ExpressionsPage />} />
      <Route path="/adjectives" element={<AdjectivesHubPage />} />
      <Route path="/adjectives/:kind" element={<AdjectivesExercisePage />} />
      <Route path="/mix" element={<MixPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/exercise/:type/:id" element={<SingleExercisePage />} />
      <Route path="/unsubscribe" element={<UnsubscribePage />} />
    </Routes>
  );
}
