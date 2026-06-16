import type { Exercise } from '../types';

interface Props {
  isCorrect: boolean;
  exercise: Exercise;
  userInput: string;
  onNext: () => void;
}

export function ResultFeedback({ isCorrect, exercise, userInput, onNext }: Props) {
  return (
    <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
      {isCorrect ? (
        <p className="result-message">
          Correct! <strong>{exercise.answer}</strong> is right.
        </p>
      ) : (
        <p className="result-message">
          <strong>{userInput}</strong> is wrong. The correct form is{' '}
          <strong>{exercise.answer}</strong>.
        </p>
      )}
      <button className="next-btn" onClick={onNext}>
        Next exercise →
      </button>
    </div>
  );
}
