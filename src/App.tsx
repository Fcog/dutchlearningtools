import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VerbsPage from './pages/VerbsPage';
import PositionalVerbsPage from './pages/PositionalVerbsPage';
import SeparableVerbsPage from './pages/SeparableVerbsPage';

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
    </Routes>
  );
}
