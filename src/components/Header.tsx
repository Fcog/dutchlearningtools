import { Link } from 'react-router-dom';

interface Score {
  correct: number;
  total: number;
}

interface Props {
  backTo?: string;
  score?: Score;
}

export function Header({ backTo, score }: Props) {
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
          <h1>Learn Dutch</h1>
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
