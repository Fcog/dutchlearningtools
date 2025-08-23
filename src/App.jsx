import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import ArticlesPage from './pages/ArticlesPage'
import VerbConjugationPage from './pages/VerbConjugationPage'
import PrepositionsPage from './pages/PrepositionsPage'
import PhrasalVerbsPage from './pages/PhrasalVerbsPage'
import ConjunctionsPage from './pages/ConjunctionsPage'
import AdjectivesPage from './pages/AdjectivesPage'
import ComparativePage from './pages/ComparativePage'
import ObjectPronounsPage from './pages/ObjectPronounsPage'
import ReflexiveVerbsPage from './pages/ReflexiveVerbsPage'
import NegationPage from './pages/NegationPage'
import NotFoundPage from './pages/NotFoundPage'
import ScrollToTop from './components/ScrollToTop'
import CookieConsent from './components/organisms/CookieConsent'
import usePageTracking from './hooks/usePageTracking'
import { initGAWithConsent } from './utils/analytics'

// Component to handle page tracking inside the Router context
function AppRoutes() {
  usePageTracking(); // Track page views on route changes
  
  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/de-het-articles" element={<ArticlesPage />} />
        <Route path="/verbs-conjugations" element={<VerbConjugationPage />} />
        <Route path="/prepositions" element={<PrepositionsPage />} />
        <Route path="/phrasal-verbs" element={<PhrasalVerbsPage />} />
        <Route path="/conjunctions" element={<ConjunctionsPage />} />
        <Route path="/adjectives" element={<AdjectivesPage />} />
        <Route path="/comparatives-superlatives" element={<ComparativePage />} />
        <Route path="/object-pronouns" element={<ObjectPronounsPage />} />
        <Route path="/reflexive-verbs" element={<ReflexiveVerbsPage />} />
        <Route path="/negation" element={<NegationPage />} />
        <Route path="/phrases" element={<div>Phrases tool coming soon!</div>} />
        <Route path="/grammar" element={<div>Grammar tool coming soon!</div>} />
        <Route path="/vocabulary" element={<div>Vocabulary tool coming soon!</div>} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    // Listen for consent granted event to initialize GA
    const handleConsentGranted = () => {
      initGAWithConsent()
    }

    window.addEventListener('cookieConsentGranted', handleConsentGranted)

    return () => {
      window.removeEventListener('cookieConsentGranted', handleConsentGranted)
    }
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
      <CookieConsent />
    </BrowserRouter>
  )
}

export default App