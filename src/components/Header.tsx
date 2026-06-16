interface Props {
  correct: number;
  total: number;
}

export function Header({ correct, total }: Props) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-flag">🇳🇱</span>
          <h1>Dutch Verbs</h1>
        </div>
        {total > 0 && (
          <div className="score">
            <span className="score-correct">{correct}</span>
            <span className="score-sep">/</span>
            <span className="score-total">{total}</span>
          </div>
        )}
      </div>
    </header>
  );
}
