import { Link } from 'react-router-dom';

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
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          {backTo ? (
            <Link to={backTo} className="back-btn" aria-label="Back">
              ←
            </Link>
          ) : null}
          <span className="logo-flag">🇳🇱</span>
          <h1>{title ?? 'Learn Dutch'}</h1>
        </div>
        {score && score.total > 0 && (
          <div className="score">
            <span className="score-correct">{score.correct}</span>
            <span className="score-sep">/</span>
            <span className="score-total">{score.total}</span>
          </div>
        )}
      </div>
    </header>
  );
}
