import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ArticlesPage from './pages/ArticlesPage'
import NotFoundPage from './pages/NotFoundPage'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/verbs" element={<div>Verbs tool coming soon!</div>} />
        <Route path="/pronunciation" element={<div>Pronunciation tool coming soon!</div>} />
        <Route path="/phrases" element={<div>Phrases tool coming soon!</div>} />
        <Route path="/grammar" element={<div>Grammar tool coming soon!</div>} />
        <Route path="/vocabulary" element={<div>Vocabulary tool coming soon!</div>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App