import type { Exercise } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { ShareScore } from './ShareScore';

interface Props {
  isCorrect: boolean;
  exercise: Exercise;
  userInput: string;
  onNext: () => void;
  score?: { correct: number; total: number };
  title?: string;
}

export function ResultFeedback({ isCorrect, exercise, userInput, onNext, score, title }: Props) {
  const { lang } = useLanguage();
  const ui = useUI();

  return (
    <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
      {isCorrect ? (
        <p className="result-message">
          {lang === 'es' ? (
            <>¡Correcto! <strong>{exercise.answer}</strong> es la forma correcta.</>
          ) : (
            <>Correct! <strong>{exercise.answer}</strong> is right.</>
          )}
        </p>
      ) : (
        <p className="result-message">
          {lang === 'es' ? (
            <><strong>{userInput}</strong> es incorrecto. La forma correcta es{' '}
            <strong>{exercise.answer}</strong>.</>
          ) : (
            <><strong>{userInput}</strong> is wrong. The correct form is{' '}
            <strong>{exercise.answer}</strong>.</>
          )}
        </p>
      )}
      {score ? (
        <ShareScore score={score} title={title} onNext={onNext} />
      ) : (
        <button className="next-btn" onClick={onNext}>
          {ui.next}
        </button>
      )}
    </div>
  );
}
