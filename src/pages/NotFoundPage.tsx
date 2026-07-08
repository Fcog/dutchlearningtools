import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function NotFoundPage() {
  const { lang } = useLanguage();
  const es = lang === 'es';
  return (
    <div className="app">
      <Header backTo="/" />
      <main className="main">
        <div className="notfound">
          <div className="notfound-code">404</div>
          <h2 className="notfound-title">{es ? 'Página no encontrada' : 'Page not found'}</h2>
          <p className="notfound-text">
            {es
              ? 'La página que buscas no existe o se ha movido.'
              : "The page you're looking for doesn't exist or has moved."}
          </p>
          <Link to="/" className="next-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
            {es ? 'Volver al inicio' : 'Back to home'} →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
