import { useState, useMemo, useEffect } from 'react';
import { SentenceCard } from '../SentenceCard';
import { ConjugationInput } from '../ConjugationInput';
import { SpeakButton } from '../SpeakButton';
import { useLanguage } from '../../context/LanguageContext';
import { useUI } from '../../i18n/ui';
import { useAdvanceOnEnter } from '../../hooks/useAdvanceOnEnter';
import type { ExerciseType } from '../../hooks/useProgress';
import type { Verb } from '../../types';
import type { SeparableVerbSet, SeparableContext } from '../../data/separableVerbs';
import type { PositionalExercise } from '../../data/positionalVerbs';
import type { DirectionalExercise } from '../../data/directionalAdverbs';
import type { FromToExercise } from '../../data/fromToAdverbs';
import type { PrepositionExercise } from '../../data/prepositionExercises';
import type { TimeExercise } from '../../data/timeExercises';
import type { ExpressionExercise } from '../../data/expressionExercises';
import type { DiminutiveExercise } from '../../data/diminutiveExercises';
import type { ArticleNoun, Article } from '../../data/articleNouns';
import type { PluralNoun } from '../../data/pluralNouns';
import type { WordOrderSentence } from '../../data/wordOrderSentences';
import type { VoorstellenExercise } from '../../data/voorstellenExercises';
import type { NegationExercise } from '../../data/negationExercises';
import type { Tense, SupportedLang } from '../../types';

type Translations = Partial<Record<SupportedLang, string>>;

// ── Normalized mix entries ───────────────────────────────────────────────────
// Each dataset is flattened into an entry tagged with how to render it, the
// progress type to record under, and a topic key for the "which topic" badge.

export interface ChoiceData {
  dutch: string;
  english: string;
  translations?: Translations;
  options: string[];
  correct: string;       // the option value that is correct
  resultAnswer: string;  // what to show as the answer in feedback
  explanation: string;
  explanationEs?: string;
}

interface VerbData {
  exercise: { dutch: string; english: string; translations?: Translations; answer: string; tense: Tense };
  infinitive: string;
}

interface SeparableData {
  exercise: { dutch: string; english: string; translations?: Translations; answer: string };
  context: SeparableContext;
}

interface MixEntryBase { key: string; exerciseId?: string; progressType: ExerciseType; topic: string }
export type MixEntry = MixEntryBase & (
  | { render: 'choice'; data: ChoiceData }
  | { render: 'verb'; data: VerbData }
  | { render: 'separable'; data: SeparableData }
  | { render: 'article'; data: ArticleNoun }
  | { render: 'plural'; data: PluralNoun }
  | { render: 'wordorder'; data: WordOrderSentence }
  | { render: 'voorstellen'; data: VoorstellenExercise }
  | { render: 'negation'; data: NegationExercise }
);

interface PoolData {
  verbs: Verb[];
  separableVerbSets: SeparableVerbSet[];
  positionalExercises: PositionalExercise[];
  directionalExercises: DirectionalExercise[];
  fromToExercises: FromToExercise[];
  prepositionExercises: PrepositionExercise[];
  timeExercises: TimeExercise[];
  expressionExercises: ExpressionExercise[];
  diminutiveExercises: DiminutiveExercise[];
  articleNouns: ArticleNoun[];
  pluralNouns: PluralNoun[];
  wordOrderSentences: WordOrderSentence[];
  voorstellenExercises: VoorstellenExercise[];
  negationExercises: NegationExercise[];
}

const POS_VERBS = ['zijn', 'zitten', 'liggen', 'staan'];

/** Flatten every dataset into a single list of normalized mix entries. */
export function buildMixPool(d: PoolData): MixEntry[] {
  const out: MixEntry[] = [];

  d.verbs.forEach((v) =>
    v.exercises.forEach((ex, i) =>
      out.push({
        key: `verb-${v.id}-${ex.id ?? i}`, exerciseId: ex.id,
        progressType: 'verb', topic: 'verb', render: 'verb',
        data: { exercise: { dutch: ex.dutch, english: ex.english, translations: ex.translations, answer: ex.answer, tense: ex.tense }, infinitive: v.infinitive },
      })));

  d.separableVerbSets.forEach((set, si) =>
    set.exercises.forEach((ex, i) =>
      out.push({
        key: `sep-${ex.id ?? `${si}-${i}`}`, exerciseId: ex.id,
        progressType: 'separable', topic: 'separable', render: 'separable',
        data: { exercise: { dutch: ex.dutch, english: ex.english, translations: ex.translations, answer: ex.answer }, context: ex.context },
      })));

  d.positionalExercises.forEach((ex, i) =>
    out.push({
      key: `pos-${ex.id ?? i}`, exerciseId: ex.id, progressType: 'positional', topic: 'positional', render: 'choice',
      data: { dutch: ex.dutch, english: ex.english, translations: ex.translations, options: POS_VERBS, correct: ex.verb, resultAnswer: `${ex.verb} (${ex.answer})`, explanation: ex.explanation, explanationEs: ex.explanationEs },
    }));

  const choiceSrc: Array<[typeof d.directionalExercises, ExerciseType, string, string]> = [
    [d.directionalExercises, 'directional', 'directional', 'dir'],
    [d.fromToExercises, 'from-to', 'from-to', 'ft'],
    [d.prepositionExercises, 'preposition', 'preposition', 'prep'],
    [d.timeExercises, 'time-prep', 'time-prep', 'time'],
    [d.expressionExercises, 'expression', 'expression', 'expr'],
    [d.diminutiveExercises, 'diminutive', 'diminutive', 'dim'],
  ];
  choiceSrc.forEach(([list, progressType, topic, prefix]) =>
    list.forEach((ex, i) =>
      out.push({
        key: `${prefix}-${ex.id ?? i}`, exerciseId: ex.id, progressType, topic, render: 'choice',
        data: { dutch: ex.dutch, english: ex.english, translations: ex.translations, options: ex.options, correct: ex.answer, resultAnswer: ex.answer, explanation: ex.explanation, explanationEs: ex.explanationEs },
      })));

  d.articleNouns.forEach((n, i) => out.push({ key: `art-${n.id ?? i}`, exerciseId: n.id, progressType: 'article', topic: 'article', render: 'article', data: n }));
  d.pluralNouns.forEach((n, i) => out.push({ key: `plu-${n.id ?? i}`, exerciseId: n.id, progressType: 'plural', topic: 'plural', render: 'plural', data: n }));
  d.wordOrderSentences.forEach((s, i) => out.push({ key: `wo-${s.id ?? i}`, exerciseId: s.id, progressType: 'word-order', topic: 'word-order', render: 'wordorder', data: s }));
  d.voorstellenExercises.forEach((e, i) => out.push({ key: `vst-${e.id ?? i}`, exerciseId: e.id, progressType: 'voorstellen', topic: 'voorstellen', render: 'voorstellen', data: e }));
  d.negationExercises.forEach((e, i) => out.push({ key: `neg-${e.id ?? i}`, exerciseId: e.id, progressType: 'negation', topic: 'negation', render: 'negation', data: e }));

  return out;
}

// ── Shared helpers ───────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface CardProps<T> {
  data: T;
  onResult: (correct: boolean) => void;
  onNext: () => void;
}

/** Renders the right card for a mix entry. Shared by MixPage and the deep-link page. */
export function MixCardRenderer({ entry, onResult, onNext }: { entry: MixEntry; onResult: (c: boolean) => void; onNext: () => void }) {
  const props = { onResult, onNext };
  switch (entry.render) {
    case 'choice':      return <ChoiceCard      data={entry.data} {...props} />;
    case 'verb':        return <VerbCard        data={entry.data} {...props} />;
    case 'separable':   return <SeparableCard   data={entry.data} {...props} />;
    case 'article':     return <ArticleCard     data={entry.data} {...props} />;
    case 'plural':      return <PluralCard      data={entry.data} {...props} />;
    case 'wordorder':   return <WordOrderCard   data={entry.data} {...props} />;
    case 'voorstellen': return <VoorstellenCard data={entry.data} {...props} />;
    case 'negation':    return <NegationCard    data={entry.data} {...props} />;
  }
}

// ── Choice card: positional / directional / from-to / prepositions / time ────
export function ChoiceCard({ data, onResult, onNext }: CardProps<ChoiceData>) {
  const { lang } = useLanguage();
  const ui = useUI();
  const [selected, setSelected] = useState<string | null>(null);
  const options = useMemo(() => shuffle(data.options), [data]);
  const done = selected !== null;
  const isCorrect = selected === data.correct;
  useAdvanceOnEnter(done, onNext);

  const exerciseForCard = { dutch: data.dutch, english: data.english, translations: data.translations, answer: data.resultAnswer, tense: 'present' as const };
  const explanation = lang === 'es' ? (data.explanationEs ?? data.explanation) : data.explanation;

  const pick = (opt: string) => {
    if (done) return;
    setSelected(opt);
    onResult(opt === data.correct);
  };

  return (
    <>
      <SentenceCard exercise={exerciseForCard} phase={done ? 'result' : 'active'} />
      <div className="pos-verb-grid">
        {options.map((opt) => {
          let cls = 'pos-verb-btn';
          if (done) {
            if (opt === data.correct) cls += ' correct';
            else if (opt === selected) cls += ' wrong';
            else cls += ' dim';
          }
          return <button key={opt} className={cls} onClick={() => pick(opt)} disabled={done}>{opt}</button>;
        })}
      </div>
      {done && (
        <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
          <p className="result-message">
            {isCorrect
              ? <>{lang === 'es' ? '¡Correcto!' : 'Correct!'} <strong>{data.resultAnswer}</strong> — {explanation}</>
              : <><strong>{selected}</strong> {lang === 'es' ? 'es incorrecto. La respuesta es' : 'is wrong. The answer is'} <strong>{data.resultAnswer}</strong>. {explanation}</>}
          </p>
          <button className="next-btn" onClick={onNext}>{ui.next}</button>
        </div>
      )}
    </>
  );
}

// ── Verb conjugation card ─────────────────────────────────────────────────────
export function VerbCard({ data, onResult, onNext }: CardProps<VerbData>) {
  const { lang } = useLanguage();
  const ui = useUI();
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);
  const isCorrect = input.trim().toLowerCase() === data.exercise.answer.toLowerCase();
  useAdvanceOnEnter(done, onNext);

  const submit = () => {
    if (done || !input.trim()) return;
    setDone(true);
    onResult(input.trim().toLowerCase() === data.exercise.answer.toLowerCase());
  };

  return (
    <>
      <SentenceCard exercise={data.exercise} phase={done ? 'result' : 'active'} />
      <p className="mix-hint">{lang === 'es' ? 'Verbo' : 'Verb'}: <strong>{data.infinitive}</strong></p>
      {!done && <ConjugationInput tense={data.exercise.tense} value={input} onChange={setInput} onSubmit={submit} />}
      {done && (
        <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
          <p className="result-message">
            {isCorrect
              ? <>{lang === 'es' ? '¡Correcto!' : 'Correct!'} <strong>{data.exercise.answer}</strong></>
              : <><strong>{input}</strong> {lang === 'es' ? 'es incorrecto. La respuesta es' : 'is wrong. The answer is'} <strong>{data.exercise.answer}</strong>.</>}
          </p>
          <button className="next-btn" onClick={onNext}>{ui.next}</button>
        </div>
      )}
    </>
  );
}

// ── Separable verb card ───────────────────────────────────────────────────────
export function SeparableCard({ data, onResult, onNext }: CardProps<SeparableData>) {
  const { lang } = useLanguage();
  const ui = useUI();
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);
  const isCorrect = input.trim().toLowerCase() === data.exercise.answer.toLowerCase();
  useAdvanceOnEnter(done, onNext);

  const label = { main: ui.mainClause, perfect: ui.presentPerfect, subordinate: ui.subordinateClause, modal: ui.modalVerb }[data.context];
  const tip = { main: ui.splitPrefix, perfect: ui.gePrefixStem, subordinate: ui.togetherEnd, modal: ui.fullInfinitive }[data.context];

  const submit = () => {
    if (done || !input.trim()) return;
    setDone(true);
    onResult(input.trim().toLowerCase() === data.exercise.answer.toLowerCase());
  };

  const exerciseForCard = { ...data.exercise, tense: 'present' as const };

  return (
    <>
      <SentenceCard exercise={exerciseForCard} phase={done ? 'result' : 'active'} label={label} />
      {!done && <ConjugationInput tense="present" value={input} onChange={setInput} onSubmit={submit} />}
      {done && (
        <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
          <p className="result-message">
            {isCorrect
              ? <>{lang === 'es' ? '¡Correcto!' : 'Correct!'} <strong>{data.exercise.answer}</strong> — {label.toLowerCase()}: {lang === 'es' ? 'el verbo' : 'the verb'} {tip}.</>
              : <><strong>{input}</strong> {lang === 'es' ? 'es incorrecto. La respuesta es' : 'is wrong. The answer is'} <strong>{data.exercise.answer}</strong>.</>}
          </p>
          <button className="next-btn" onClick={onNext}>{ui.next}</button>
        </div>
      )}
    </>
  );
}

// ── Article (de/het) card ─────────────────────────────────────────────────────
const ARTICLES: Article[] = ['de', 'het'];
export function ArticleCard({ data, onResult, onNext }: CardProps<ArticleNoun>) {
  const { lang } = useLanguage();
  const ui = useUI();
  const [selected, setSelected] = useState<Article | null>(null);
  const done = selected !== null;
  const isCorrect = selected === data.article;
  useAdvanceOnEnter(done, onNext);

  const translation = lang === 'es' ? (data.translations?.es ?? data.english) : data.english;
  const tip = lang === 'es' ? (data.tipEs ?? data.tip) : data.tip;

  const pick = (a: Article) => {
    if (done) return;
    setSelected(a);
    onResult(a === data.article);
  };

  return (
    <>
      <div className="article-card">
        <div className="article-card-top">
          <span className={`level-badge level-badge-${data.level.toLowerCase()}`}>{data.level}</span>
          <SpeakButton text={() => (done ? `${data.article} ${data.noun}` : data.noun)} />
        </div>
        <div className="article-prompt">{lang === 'es' ? '¿Cuál es el artículo?' : 'Which article?'}</div>
        <div className="article-noun">
          {done
            ? <><span className={`article-answer ${isCorrect ? 'correct' : 'wrong'}`}>{data.article}</span> {data.noun}</>
            : <><span className="article-blank">___</span> {data.noun}</>}
        </div>
        <div className="article-english">{translation}</div>
      </div>
      <div className="article-btn-grid">
        {ARTICLES.map((a) => {
          let cls = 'article-btn';
          if (done) {
            if (a === data.article) cls += ' correct';
            else if (a === selected) cls += ' wrong';
            else cls += ' dim';
          }
          return <button key={a} className={cls} onClick={() => pick(a)} disabled={done}>{a}</button>;
        })}
      </div>
      {done && (
        <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
          <p className="result-message">
            {isCorrect
              ? <>{lang === 'es' ? '¡Correcto! Es' : "Correct! It's"} <strong>{data.article} {data.noun}</strong>.</>
              : <>{lang === 'es' ? 'Incorrecto. Es' : "Wrong. It's"} <strong>{data.article} {data.noun}</strong>.</>}
            {tip && <><br /><span className="result-tip">{tip}</span></>}
          </p>
          <button className="next-btn" onClick={onNext}>{ui.next}</button>
        </div>
      )}
    </>
  );
}

// ── Plural card (type-in) ─────────────────────────────────────────────────────
export function PluralCard({ data, onResult, onNext }: CardProps<PluralNoun>) {
  const { lang } = useLanguage();
  const ui = useUI();
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);
  // Plurals always take the article "de" — require it in the answer.
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
  const isCorrect = norm(input) === norm(`de ${data.plural}`);
  useAdvanceOnEnter(done, onNext);

  const translation = lang === 'es' ? (data.translations?.es ?? data.english) : data.english;
  const tip = lang === 'es' ? (data.tipEs ?? data.tip) : data.tip;

  const submit = () => {
    if (done || !input.trim()) return;
    setDone(true);
    onResult(norm(input) === norm(`de ${data.plural}`));
  };

  return (
    <>
      <div className="article-card">
        <div className="article-card-top">
          <span className={`level-badge level-badge-${data.level.toLowerCase()}`}>{data.level}</span>
          <SpeakButton text={() => (done ? data.plural : `${data.article} ${data.singular}`)} />
        </div>
        <div className="article-prompt">{lang === 'es' ? '¿Cuál es el plural?' : 'What is the plural?'}</div>
        <div className="article-noun">
          <span className="plural-article">{data.article}</span>{' '}
          {done ? <span className={isCorrect ? 'article-answer correct' : 'article-answer wrong'}>{data.singular}</span> : data.singular}
        </div>
        <div className="article-english">{translation}</div>
        {done && <div className="plural-result-noun">de {data.plural}</div>}
      </div>
      <div className="input-row">
        <input
          className="conj-field" type="text" placeholder={ui.typePlural} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          disabled={done} autoComplete="off" autoCorrect="off" spellCheck={false} autoFocus
        />
        <button className="submit-btn" onClick={done ? onNext : submit} disabled={!done && !input.trim()}>
          {done ? ui.next : ui.check}
        </button>
      </div>
      {done && (
        <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
          <p className="result-message">
            {isCorrect
              ? <>{lang === 'es' ? '¡Correcto! El plural es' : 'Correct! The plural is'} <strong>de {data.plural}</strong>.</>
              : <>{lang === 'es' ? 'Incorrecto. El plural es' : 'Wrong. The plural is'} <strong>de {data.plural}</strong>.</>}
            {tip && <><br /><span className="result-tip">{tip}</span></>}
          </p>
          <button className="next-btn" onClick={onNext}>{ui.next}</button>
        </div>
      )}
    </>
  );
}

// ── Word order card (tap arrange) ─────────────────────────────────────────────
interface WOToken { word: string; id: number }
export function WordOrderCard({ data, onResult, onNext }: CardProps<WordOrderSentence>) {
  const { lang } = useLanguage();
  const ui = useUI();
  const tokens = useMemo<WOToken[]>(() => {
    const base = data.words.map((word, i) => ({ word, id: i }));
    let s = shuffle(base);
    while (s.length > 1 && s.map((t) => t.word).join(' ') === data.words.join(' ')) s = shuffle(base);
    return s;
  }, [data]);
  const [bank, setBank] = useState<number[]>(() => tokens.map((_, i) => i));
  const [placed, setPlaced] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  useAdvanceOnEnter(done, onNext);
  useEffect(() => () => window.speechSynthesis.cancel(), []);

  const place = (pos: number) => { if (done) return; setBank((b) => b.filter((p) => p !== pos)); setPlaced((p) => [...p, pos]); };
  const ret = (pos: number) => { if (done) return; setPlaced((p) => p.filter((x) => x !== pos)); setBank((b) => [...b, pos]); };
  const check = () => {
    if (done || placed.length !== tokens.length) return;
    const correct = placed.map((p) => tokens[p].word).join(' ') === data.words.join(' ');
    setIsCorrect(correct); setDone(true); onResult(correct);
  };
  const explanation = lang === 'es' ? (data.explanationEs ?? data.explanation) : data.explanation;

  return (
    <>
      <div className="wo-card">
        <div className="article-card-top">
          <span className={`level-badge level-badge-${data.level.toLowerCase()}`}>{data.level}</span>
          <SpeakButton text={() => data.words.join(' ')} />
        </div>
        <p className="word-order-prompt">{ui.wordOrderPrompt}</p>
        <p className="word-order-english">{lang === 'es' ? (data.translations?.es ?? data.english) : data.english}</p>
      </div>
      <div className="wo-section">
        <span className="word-section-label">{ui.wordOrderWordsLabel}</span>
        <div className="word-chips">
          {bank.map((pos) => <button key={pos} className="word-chip" onClick={() => place(pos)} disabled={done}>{tokens[pos].word}</button>)}
        </div>
      </div>
      <div className="wo-section">
        <span className="word-section-label">{ui.wordOrderSentenceLabel}</span>
        <div className="sentence-area-box">
          {placed.length === 0
            ? <span className="sentence-placeholder">{ui.wordOrderPlaceholder}</span>
            : placed.map((pos, idx) => (
                <button key={`${pos}-${idx}`} className={`word-chip placed${done ? (isCorrect ? ' correct' : ' wrong') : ''}`} onClick={() => ret(pos)} disabled={done}>{tokens[pos].word}</button>
              ))}
        </div>
      </div>
      {!done && (
        <div className="input-row">
          <button className="submit-btn" style={{ marginLeft: 'auto' }} onClick={check} disabled={placed.length !== tokens.length}>{ui.check}</button>
        </div>
      )}
      {done && (
        <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
          <p className="result-message">
            {isCorrect
              ? <>{lang === 'es' ? '¡Correcto!' : 'Correct!'} <strong>{data.words.join(' ')}</strong></>
              : <>{lang === 'es' ? 'Incorrecto. El orden correcto es:' : 'Wrong. The correct order is:'} <strong>{data.words.join(' ')}</strong></>}
            <br /><span className="result-tip">{explanation}</span>
          </p>
          <button className="next-btn" onClick={onNext}>{ui.next}</button>
        </div>
      )}
    </>
  );
}

// ── Voorstellen card (tap fill blanks) ────────────────────────────────────────
export function VoorstellenCard({ data, onResult, onNext }: CardProps<VoorstellenExercise>) {
  const { lang } = useLanguage();
  const ui = useUI();
  const segments = useMemo(() => data.gapped.split('___'), [data]);
  const tokens = useMemo<WOToken[]>(() => shuffle(data.bank.map((word, i) => ({ word, id: i }))), [data]);
  const numBlanks = data.answers.length;
  const [slots, setSlots] = useState<(number | null)[]>(() => Array(numBlanks).fill(null));
  const [done, setDone] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  useAdvanceOnEnter(done, onNext);

  const usedPositions = new Set(slots.filter((s): s is number => s !== null));
  const bankPositions = tokens.map((_, pos) => pos).filter((pos) => !usedPositions.has(pos));

  const placeToken = (pos: number) => {
    if (done) return;
    setSlots((prev) => { const fe = prev.indexOf(null); if (fe === -1) return prev; const n = [...prev]; n[fe] = pos; return n; });
  };
  const returnSlot = (i: number) => { if (done) return; setSlots((prev) => { const n = [...prev]; n[i] = null; return n; }); };
  const check = () => {
    if (done || slots.some((s) => s === null)) return;
    const correct = slots.every((pos, i) => pos !== null && tokens[pos].word === data.answers[i]);
    setIsCorrect(correct); setDone(true); onResult(correct);
  };
  const explanation = lang === 'es' ? (data.explanationEs ?? data.explanation) : data.explanation;
  const displayTranslation = lang === 'es' ? (data.translations?.es ?? data.english) : data.english;

  return (
    <>
      <div className="wo-card">
        <div className="article-card-top">
          <span className={`level-badge level-badge-${data.level.toLowerCase()}`}>{data.level}</span>
          <SpeakButton text={() => data.dutch} />
        </div>
        <p className="word-order-prompt">{ui.voorstellenPrompt}</p>
        <p className="word-order-english">{displayTranslation}</p>
      </div>
      <div className="wo-section">
        <span className="word-section-label">{ui.voorstellenSentenceLabel}</span>
        <div className="sentence-area-box vst-sentence">
          {segments.map((seg, i) => {
            const slotPos = i < numBlanks ? slots[i] : undefined;
            return (
              <span key={i} className="vst-segment">
                {seg && <span className="vst-text">{seg}</span>}
                {i < numBlanks && (slotPos != null
                  ? <button className={`word-chip placed${done ? (isCorrect ? ' correct' : ' wrong') : ''}`} onClick={() => returnSlot(i)} disabled={done}>{tokens[slotPos].word}</button>
                  : <span className="vst-blank">_____</span>)}
              </span>
            );
          })}
        </div>
      </div>
      <div className="wo-section">
        <span className="word-section-label">{ui.voorstellenWordsLabel}</span>
        <div className="word-chips">
          {bankPositions.map((pos) => <button key={pos} className="word-chip" onClick={() => placeToken(pos)} disabled={done}>{tokens[pos].word}</button>)}
        </div>
      </div>
      {!done && (
        <div className="input-row">
          <button className="submit-btn" style={{ marginLeft: 'auto' }} onClick={check} disabled={slots.some((s) => s === null)}>{ui.check}</button>
        </div>
      )}
      {done && (
        <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
          <p className="result-message">
            {isCorrect
              ? <>{lang === 'es' ? '¡Correcto!' : 'Correct!'} <strong>{data.dutch}</strong></>
              : <>{lang === 'es' ? 'Incorrecto. La respuesta correcta es:' : 'Wrong. The correct answer is:'} <strong>{data.dutch}</strong></>}
            <br /><span className="result-tip">{explanation}</span>
          </p>
          <button className="next-btn" onClick={onNext}>{ui.next}</button>
        </div>
      )}
    </>
  );
}

// ── Negation card (tap place niet/geen) ───────────────────────────────────────
type Placement = { word: 'niet' | 'geen'; kind: 'gap' | 'replace'; index: number };
function buildNegated(ex: NegationExercise): string {
  if (ex.mode === 'replace') return ex.words.map((w, i) => (i === ex.position ? ex.negator : w)).join(' ');
  const w = [...ex.words]; w.splice(ex.position, 0, ex.negator); return w.join(' ');
}
export function NegationCard({ data, onResult, onNext }: CardProps<NegationExercise>) {
  const { lang } = useLanguage();
  const ui = useUI();
  const [armed, setArmed] = useState<'niet' | 'geen' | null>(null);
  const [placed, setPlaced] = useState<Placement | null>(null);
  const [done, setDone] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  useAdvanceOnEnter(done, onNext);

  const placeAt = (kind: 'gap' | 'replace', i: number) => {
    if (done) return;
    setArmed((a) => { if (!a) return a; setPlaced({ word: a, kind, index: i }); return a; });
  };
  const check = () => {
    if (done || !placed) return;
    const expectedKind = data.mode === 'insert' ? 'gap' : 'replace';
    const correct = placed.word === data.negator && placed.kind === expectedKind && placed.index === data.position;
    setIsCorrect(correct); setDone(true); onResult(correct);
  };
  const negated = buildNegated(data);
  const chipClass = done ? (isCorrect ? ' correct' : ' wrong') : '';
  const explanation = lang === 'es' ? (data.explanationEs ?? data.explanation) : data.explanation;

  const nodes: React.ReactNode[] = [];
  for (let i = 0; i <= data.words.length; i++) {
    const placedHere = placed && placed.kind === 'gap' && placed.index === i;
    nodes.push(placedHere
      ? <button key={`g${i}`} className={`word-chip placed${chipClass}`} onClick={() => !done && setPlaced(null)} disabled={done}>{placed!.word}</button>
      : <button key={`g${i}`} className={`neg-gap${armed && !done ? ' armed' : ''}`} onClick={() => placeAt('gap', i)} disabled={done || !armed}>{armed && !done ? '+' : ''}</button>);
    if (i < data.words.length) {
      const word = data.words[i];
      const replacedHere = placed && placed.kind === 'replace' && placed.index === i;
      if (replacedHere) nodes.push(<button key={`t${i}`} className={`word-chip placed${chipClass}`} onClick={() => !done && setPlaced(null)} disabled={done}>{placed!.word}</button>);
      else if (word.toLowerCase() === 'een') nodes.push(<button key={`t${i}`} className={`neg-token replaceable${armed && !done ? ' armed' : ''}`} onClick={() => placeAt('replace', i)} disabled={done || !armed}>{word}</button>);
      else nodes.push(<span key={`t${i}`} className="vst-text">{word}</span>);
    }
  }

  return (
    <>
      <div className="wo-card">
        <div className="article-card-top">
          <span className={`level-badge level-badge-${data.level.toLowerCase()}`}>{data.level}</span>
          {done && <span className="wo-rule-badge">{data.negator}</span>}
          <SpeakButton text={() => (done ? negated : data.words.join(' '))} />
        </div>
        <p className="word-order-prompt">{ui.negationPrompt}</p>
        <p className="word-order-english">{lang === 'es' ? (data.translations?.es ?? data.english) : data.english}</p>
      </div>
      <div className="wo-section">
        <span className="word-section-label">{ui.negationSentenceLabel}</span>
        <div className="sentence-area-box vst-sentence neg-sentence">{nodes}</div>
      </div>
      <div className="wo-section">
        <span className="word-section-label">{ui.negationWordsLabel}</span>
        <div className="word-chips">
          {(['niet', 'geen'] as const).map((w) => (
            <button key={w} className={`word-chip${armed === w ? ' armed' : ''}`} onClick={() => !done && setArmed(w)} disabled={done}>{w}</button>
          ))}
        </div>
      </div>
      {!done && (
        <div className="input-row">
          <button className="submit-btn" style={{ marginLeft: 'auto' }} onClick={check} disabled={!placed}>{ui.check}</button>
        </div>
      )}
      {done && (
        <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
          <p className="result-message">
            {isCorrect
              ? <>{lang === 'es' ? '¡Correcto!' : 'Correct!'} <strong>{negated}</strong></>
              : <>{lang === 'es' ? 'Incorrecto. La respuesta correcta es:' : 'Wrong. The correct answer is:'} <strong>{negated}</strong></>}
            <br /><span className="result-tip">{explanation}</span>
          </p>
          <button className="next-btn" onClick={onNext}>{ui.next}</button>
        </div>
      )}
    </>
  );
}
