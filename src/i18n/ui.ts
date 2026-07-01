import type { SupportedLang } from '../types';
import { useLanguage } from '../context/LanguageContext';

const en = {
  // Buttons
  check: 'Check',
  next: 'Next',
  // Header / nav
  filters: 'Filters',
  closeFilters: 'Close filters',
  howToPlay: 'How to play',
  theory: '📖 Theory',
  learnDutch: 'Dutch Learning Tools',
  back: 'Back',
  // Verb choices
  verbs: 'Verbs',
  help: 'Help',
  hideHints: 'Hide hints',
  // TTS
  readAloud: 'Read aloud',
  stop: 'Stop',
  // Tense labels (sentence card badge)
  presentTense: 'Present tense',
  simplePast: 'Simple past',
  presentPerfect: 'Present perfect',
  // Filter labels
  levelLabel: 'Level:',
  beginner: 'Beginner',
  elementary: 'Elementary',
  intermediate: 'Intermediate',
  tenseLabel: 'Tense:',
  present: 'Present',
  // Input placeholders
  typePastParticiple: 'Type the past participle…',
  typeConjugation: 'Type the conjugated form…',
  // Empty state
  noExercises: 'No exercises match the selected filters. Try enabling more levels or tenses.',
  // Home page
  practiceQuestion: 'What do you want to practise?',
  chooseTopic: 'Choose a topic to start an exercise.',
  verbConjugationName: 'Verb Conjugation',
  verbConjugationDesc: 'Practice present, simple past, and present perfect tense across 269 Dutch verbs.',
  separableVerbsName: 'Separable Verbs',
  separableVerbsDesc: 'Master when to split or combine the prefix across main clauses, perfect, subordinate and modal constructions.',
  positionVerbsName: 'Position Verbs',
  positionVerbsDesc: 'Learn when to use staan, liggen, zitten and zijn to describe where things are.',
  directionalAdverbsName: 'Directional Adverbs',
  directionalAdverbsDesc: 'Tell voor-/achter- adverbs apart: vooraan, achteruit, achterop, achterom, naar voren and more.',
  fromToName: 'From & To',
  fromToDesc: 'Choose vandaan, heen or toe to say where you come from and where you are going.',
  // Home page — articles module
  articlesName: 'De / Het Articles',
  articlesDesc: 'Practice choosing the correct definite article for 140+ common Dutch nouns.',
  articlesTitle: 'De / Het',
  // Home page — plurals module
  pluralsName: 'Plural Forms',
  pluralsDesc: 'Type the correct plural of 70+ Dutch nouns — covering -en, -s, -eren, and irregular forms.',
  pluralsTitle: 'Plural Forms',
  typePlural: 'Type the plural form…',
  showHint: 'Hint',
  hideHint: 'Hide hint',
  // Home page — word order module
  wordOrderName: 'Word Order',
  wordOrderDesc: 'Rearrange scrambled words into correct Dutch sentences — V2 rule, fronting, subordinate inversion.',
  wordOrderTitle: 'Word Order',
  // Word order exercise
  wordOrderPrompt: 'Arrange the words in the correct order:',
  wordOrderWordsLabel: 'Words',
  wordOrderSentenceLabel: 'Your sentence',
  wordOrderPlaceholder: 'Click words above to build the sentence',
  wordOrderClear: 'Clear',
  // Page titles
  verbConjugationTitle: 'Verb Conjugation',
  separableVerbsTitle: 'Separable Verbs',
  positionVerbsTitle: 'Position Verbs',
  directionalAdverbsTitle: 'Directional Adverbs',
  fromToTitle: 'From & To',
  // Separable verb context labels
  mainClause: 'Main clause',
  subordinateClause: 'Subordinate clause',
  modalVerb: 'Modal verb',
  // Separable verb feedback snippets
  splitPrefix: 'splits, prefix goes to the end',
  gePrefixStem: 'gets ge- between prefix and stem',
  togetherEnd: 'stays together at the end of the clause',
  fullInfinitive: 'stays as a full infinitive after the modal',
  // Help bubbles (verb conjugation page)
  helpSentence: 'This sentence has a missing verb shown as ___. Read it carefully — the translation below gives you the context you need.',
  helpVerbs: 'Three verbs are shown as reference. Pick the one that fits the sentence. Tap Help on any card to reveal its translation.',
  helpInput: 'Type the chosen verb in its correct conjugated form — matching the subject and tense shown above. Then press Enter or tap Check.',
} as const;

type UIStrings = { readonly [K in keyof typeof en]: string };

const es: UIStrings = {
  check: 'Comprobar',
  next: 'Siguiente',
  filters: 'Filtros',
  closeFilters: 'Cerrar filtros',
  howToPlay: 'Cómo jugar',
  theory: '📖 Teoría',
  learnDutch: 'Dutch Learning Tools',
  back: 'Volver',
  verbs: 'Verbos',
  help: 'Ayuda',
  hideHints: 'Ocultar pistas',
  readAloud: 'Leer en voz alta',
  stop: 'Detener',
  presentTense: 'Tiempo presente',
  simplePast: 'Pasado simple',
  presentPerfect: 'Pretérito perfecto',
  levelLabel: 'Nivel:',
  beginner: 'Principiante',
  elementary: 'Elemental',
  intermediate: 'Intermedio',
  tenseLabel: 'Tiempo:',
  present: 'Presente',
  typePastParticiple: 'Escribe el participio pasado…',
  typeConjugation: 'Escribe la forma conjugada…',
  noExercises: 'Ningún ejercicio coincide con los filtros. Intenta activar más niveles o tiempos.',
  practiceQuestion: '¿Qué quieres practicar?',
  chooseTopic: 'Elige un tema para empezar un ejercicio.',
  verbConjugationName: 'Conjugación de verbos',
  verbConjugationDesc: 'Practica el tiempo presente, pasado simple y pretérito perfecto con 269 verbos neerlandeses.',
  separableVerbsName: 'Verbos separables',
  separableVerbsDesc: 'Domina cuándo separar o unir el prefijo en oraciones principales, perfectas, subordinadas y con modal.',
  positionVerbsName: 'Verbos de posición',
  positionVerbsDesc: 'Aprende cuándo usar staan, liggen, zitten y zijn para describir dónde están las cosas.',
  directionalAdverbsName: 'Adverbios direccionales',
  directionalAdverbsDesc: 'Distingue los adverbios con voor-/achter-: vooraan, achteruit, achterop, achterom, naar voren y más.',
  fromToName: 'Origen y destino',
  fromToDesc: 'Elige vandaan, heen o toe para decir de dónde vienes y a dónde vas.',
  articlesName: 'Los artículos de / het',
  articlesDesc: 'Practica elegir el artículo determinado correcto para más de 140 sustantivos neerlandeses comunes.',
  articlesTitle: 'De / Het',
  pluralsName: 'Formas del plural',
  pluralsDesc: 'Escribe el plural correcto de más de 70 sustantivos neerlandeses — -en, -s, -eren e irregulares.',
  pluralsTitle: 'Formas del plural',
  typePlural: 'Escribe la forma en plural…',
  showHint: 'Pista',
  hideHint: 'Ocultar pista',
  wordOrderName: 'Orden de palabras',
  wordOrderDesc: 'Reordena palabras mezcladas en oraciones neerlandesas correctas — regla V2, anteposición, inversión subordinada.',
  wordOrderTitle: 'Orden de palabras',
  wordOrderPrompt: 'Ordena las palabras correctamente:',
  wordOrderWordsLabel: 'Palabras',
  wordOrderSentenceLabel: 'Tu oración',
  wordOrderPlaceholder: 'Haz clic en las palabras para construir la oración',
  wordOrderClear: 'Borrar',
  verbConjugationTitle: 'Conjugación de verbos',
  separableVerbsTitle: 'Verbos separables',
  positionVerbsTitle: 'Verbos de posición',
  directionalAdverbsTitle: 'Adverbios direccionales',
  fromToTitle: 'Origen y destino',
  mainClause: 'Oración principal',
  subordinateClause: 'Oración subordinada',
  modalVerb: 'Verbo modal',
  splitPrefix: 'se separa, el prefijo va al final',
  gePrefixStem: 'inserta ge- entre el prefijo y el radical',
  togetherEnd: 'permanece junto al final de la oración',
  fullInfinitive: 'permanece como infinitivo completo después del modal',
  helpSentence: 'Esta frase tiene un verbo que falta, indicado como ___. Léela con atención — la traducción de abajo te da el contexto.',
  helpVerbs: 'Se muestran tres verbos como referencia. Elige el que encaje en la frase. Pulsa Ayuda en cualquier tarjeta para ver su traducción.',
  helpInput: 'Escribe el verbo elegido en su forma conjugada correcta, según el sujeto y el tiempo indicados. Pulsa Intro o Comprobar.',
};

const TRANSLATIONS: Record<SupportedLang, UIStrings> = { en, es };

export function useUI(): UIStrings {
  const { lang } = useLanguage();
  return TRANSLATIONS[lang];
}
