import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ArticlesPage from './pages/ArticlesPage'
import VerbConjugationPage from './pages/VerbConjugationPage'
import NotFoundPage from './pages/NotFoundPage'
import ScrollToTop from './components/ScrollToTop'
import usePageTracking from './hooks/usePageTracking'

// Component to handle page tracking inside the Router context
function AppRoutes() {
  usePageTracking(); // Track page views on route changes
  
  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/verbs" element={<VerbConjugationPage />} />
        <Route path="/pronunciation" element={<div>Pronunciation tool coming soon!</div>} />
        <Route path="/phrases" element={<div>Phrases tool coming soon!</div>} />
        <Route path="/grammar" element={<div>Grammar tool coming soon!</div>} />
        <Route path="/vocabulary" element={<div>Vocabulary tool coming soon!</div>} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App