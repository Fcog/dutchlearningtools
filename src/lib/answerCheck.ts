/**
 * Answer handling for the verb-conjugation exercise.
 *
 * Separable verbs (e.g. invullen) split in a main clause: the finite verb fills
 * the blank while the prefix moves to the end of the sentence — which is already
 * printed in the prompt:  "Wij ___ samen de lijst in."  The generated answer
 * sometimes redundantly includes that separated prefix ("vulden in"), so the
 * only correct fill ("vulden") was marked wrong and the feedback/audio showed
 * the ungrammatical "vulden in" ("Wij vulden in samen de lijst in.").
 *
 * `canonicalAnswer` returns the form that actually fits the blank by dropping a
 * trailing token that is already present in the sentence. It is a no-op for
 * every normal (single-token) answer, so it is safe to use anywhere an answer
 * is checked, displayed, or spoken.
 */

// Letters that make up a word, incl. the accented characters used in Dutch.
const WORD_RE = /[\p{L}]+/gu;

export function canonicalAnswer(dutch: string, answer: string): string {
  const trimmed = answer.trim();
  const tokens = trimmed.split(/\s+/);
  if (tokens.length < 2) return trimmed;

  const prefix = tokens[tokens.length - 1].toLowerCase();
  // Words already in the sentence (blank removed, punctuation stripped).
  const sentenceWords: string[] = dutch.toLowerCase().replace(/_+/g, ' ').match(WORD_RE) ?? [];
  if (sentenceWords.includes(prefix)) {
    return tokens.slice(0, -1).join(' ');
  }
  return trimmed;
}

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * True when the user's input matches the answer. Accepts the stored answer as
 * well as its canonical (separated-prefix-trimmed) form, so a separable verb is
 * correct whether or not the learner retypes the prefix already in the sentence.
 */
export function isConjugationCorrect(dutch: string, answer: string, userInput: string): boolean {
  const user = normalize(userInput);
  if (!user) return false;
  return user === normalize(answer) || user === normalize(canonicalAnswer(dutch, answer));
}
