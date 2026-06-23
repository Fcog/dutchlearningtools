import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';

interface Score {
  correct: number;
  total: number;
}

interface Props {
  backTo?: string;
  score?: Score;
  title?: string;
}

export function Header({ backTo, score, title }: Props) {
  const { lang, setLang } = useLanguage();
  const ui = useUI();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          {backTo ? (
            <Link to={backTo} className="back-btn" aria-label={ui.back}>
              ←
            </Link>
          ) : null}
          <span className="logo-flag">🇳🇱</span>
          <h1>{title ?? ui.learnDutch}</h1>
        </div>
        <div className="header-right">
          {score && score.total > 0 && (
            <div className="score">
              <span className="score-correct">{score.correct}</span>
              <span className="score-sep">/</span>
              <span className="score-total">{score.total}</span>
            </div>
          )}
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
        </div>
      </div>
    </header>
  );
}
