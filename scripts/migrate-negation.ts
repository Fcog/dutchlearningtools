import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: fetch as typeof fetch }, realtime: { transport: ws } }
);

// Dutch negation: choosing geen vs niet AND placing it correctly. The learner
// starts from the affirmative sentence (`words`) and taps niet/geen into the
// right spot. `mode: 'insert'` drops it in gap `position` (before that token,
// gaps run 0..words.length); `mode: 'replace'` swaps the "een" at token
// `position` for "geen".
const rows = [
  // ── geen: replaces the indefinite article "een" ───────────────────────────
  { id: 'neg-geen-auto', english: "I don't have a car.", translation_es: 'No tengo coche.',
    words: ['Ik', 'heb', 'een', 'auto'], negator: 'geen', mode: 'replace', position: 2,
    explanation: 'geen negates an indefinite noun. It replaces the article "een": een auto → geen auto.',
    explanation_es: 'geen niega un sustantivo indefinido. Sustituye al artículo "een": een auto → geen auto.', level: 'A1' },
  { id: 'neg-geen-hond', english: "We don't have a dog.", translation_es: 'No tenemos perro.',
    words: ['Wij', 'hebben', 'een', 'hond'], negator: 'geen', mode: 'replace', position: 2,
    explanation: 'geen replaces "een" in front of the noun: een hond → geen hond.',
    explanation_es: 'geen sustituye a "een" delante del sustantivo: een hond → geen hond.', level: 'A1' },
  { id: 'neg-geen-fiets', english: "She doesn't have a bike.", translation_es: 'Ella no tiene bicicleta.',
    words: ['Zij', 'heeft', 'een', 'fiets'], negator: 'geen', mode: 'replace', position: 2,
    explanation: 'An indefinite noun with "een" is negated with geen, which takes the article\'s place.',
    explanation_es: 'Un sustantivo indefinido con "een" se niega con geen, que ocupa el lugar del artículo.', level: 'A1' },

  // ── geen: inserted before a bare / plural / uncountable noun ───────────────
  { id: 'neg-geen-koffie', english: "I don't drink coffee.", translation_es: 'No bebo café.',
    words: ['Ik', 'drink', 'koffie'], negator: 'geen', mode: 'insert', position: 2,
    explanation: 'geen also negates a bare (article-less) noun. It goes directly before the noun: geen koffie.',
    explanation_es: 'geen también niega un sustantivo sin artículo. Va justo delante del sustantivo: geen koffie.', level: 'A1' },
  { id: 'neg-geen-vlees', english: "He doesn't eat meat.", translation_es: 'Él no come carne.',
    words: ['Hij', 'eet', 'vlees'], negator: 'geen', mode: 'insert', position: 2,
    explanation: 'Uncountable, article-less noun → geen, placed right before it: geen vlees.',
    explanation_es: 'Sustantivo incontable y sin artículo → geen, justo delante: geen vlees.', level: 'A1' },
  { id: 'neg-geen-kinderen', english: 'She has no children.', translation_es: 'Ella no tiene hijos.',
    words: ['Zij', 'heeft', 'kinderen'], negator: 'geen', mode: 'insert', position: 2,
    explanation: 'A plural noun with no article is negated with geen: geen kinderen.',
    explanation_es: 'Un sustantivo plural sin artículo se niega con geen: geen kinderen.', level: 'A1' },
  { id: 'neg-geen-tijd', english: 'I have no time.', translation_es: 'No tengo tiempo.',
    words: ['Ik', 'heb', 'tijd'], negator: 'geen', mode: 'insert', position: 2,
    explanation: 'geen tijd — geen sits directly in front of the bare noun.',
    explanation_es: 'geen tijd — geen va justo delante del sustantivo sin artículo.', level: 'A1' },
  { id: 'neg-geen-huisdieren', english: 'We have no pets.', translation_es: 'No tenemos mascotas.',
    words: ['Wij', 'hebben', 'huisdieren'], negator: 'geen', mode: 'insert', position: 2,
    explanation: 'Plural, article-less noun → geen, immediately before the noun.',
    explanation_es: 'Sustantivo plural y sin artículo → geen, justo delante del sustantivo.', level: 'A2' },

  // ── niet: end of the clause (pronoun / definite object) ────────────────────
  { id: 'neg-niet-hem', english: "I don't see him.", translation_es: 'No lo veo.',
    words: ['Ik', 'zie', 'hem'], negator: 'niet', mode: 'insert', position: 3,
    explanation: 'niet negates the verb and comes after the object pronoun "hem", at the end of the clause.',
    explanation_es: 'niet niega el verbo y va detrás del pronombre objeto "hem", al final de la oración.', level: 'A1' },
  { id: 'neg-niet-de-man', english: "I don't know the man.", translation_es: 'No conozco al hombre.',
    words: ['Ik', 'ken', 'de', 'man'], negator: 'niet', mode: 'insert', position: 4,
    explanation: 'A definite noun ("de man") is negated with niet, which goes to the end of the clause.',
    explanation_es: 'Un sustantivo definido ("de man") se niega con niet, que va al final de la oración.', level: 'A2' },
  { id: 'neg-niet-liedje', english: "She doesn't know this song.", translation_es: 'Ella no conoce esta canción.',
    words: ['Zij', 'kent', 'dit', 'liedje'], negator: 'niet', mode: 'insert', position: 4,
    explanation: '"dit liedje" is definite, so use niet — placed at the end, after the object.',
    explanation_es: '"dit liedje" es definido, así que se usa niet — al final, tras el objeto.', level: 'A2' },

  // ── niet: before a predicate adjective ─────────────────────────────────────
  { id: 'neg-niet-groot', english: "The house isn't big.", translation_es: 'La casa no es grande.',
    words: ['Het', 'huis', 'is', 'groot'], negator: 'niet', mode: 'insert', position: 3,
    explanation: 'niet comes directly before a predicate adjective: is niet groot.',
    explanation_es: 'niet va justo delante de un adjetivo predicativo: is niet groot.', level: 'A2' },
  { id: 'neg-niet-warm', english: "The soup isn't warm.", translation_es: 'La sopa no está caliente.',
    words: ['De', 'soep', 'is', 'warm'], negator: 'niet', mode: 'insert', position: 3,
    explanation: 'A predicate adjective is negated by putting niet right in front of it: niet warm.',
    explanation_es: 'Un adjetivo predicativo se niega poniendo niet justo delante: niet warm.', level: 'A2' },

  // ── niet: before a prepositional phrase / place ────────────────────────────
  { id: 'neg-niet-amsterdam', english: "I don't live in Amsterdam.", translation_es: 'No vivo en Ámsterdam.',
    words: ['Ik', 'woon', 'in', 'Amsterdam'], negator: 'niet', mode: 'insert', position: 2,
    explanation: 'niet comes before a prepositional phrase of place: niet in Amsterdam.',
    explanation_es: 'niet va delante de un complemento preposicional de lugar: niet in Amsterdam.', level: 'A2' },
  { id: 'neg-niet-school', english: "We aren't going to school.", translation_es: 'No vamos a la escuela.',
    words: ['Wij', 'gaan', 'naar', 'school'], negator: 'niet', mode: 'insert', position: 2,
    explanation: 'The direction phrase "naar school" is a PP, so niet goes in front of it.',
    explanation_es: 'El complemento de dirección "naar school" es preposicional, así que niet va delante.', level: 'A2' },

  // ── niet: after a definite time expression ─────────────────────────────────
  { id: 'neg-niet-vandaag', english: "I'm not working today.", translation_es: 'Hoy no trabajo.',
    words: ['Ik', 'werk', 'vandaag'], negator: 'niet', mode: 'insert', position: 3,
    explanation: 'niet comes after a definite time expression ("vandaag"), at the end of the clause.',
    explanation_es: 'niet va detrás de una expresión de tiempo definida ("vandaag"), al final de la oración.', level: 'A2' },

  // ── niet: before a separable prefix ────────────────────────────────────────
  { id: 'neg-niet-opbellen', english: "I'm not calling you.", translation_es: 'No te llamo.',
    words: ['Ik', 'bel', 'je', 'op'], negator: 'niet', mode: 'insert', position: 3,
    explanation: 'With a separable verb, niet goes before the prefix at the end: bel … niet op.',
    explanation_es: 'Con un verbo separable, niet va delante del prefijo al final: bel … niet op.', level: 'B1' },
  { id: 'neg-niet-opruimen', english: "I'm not tidying my room.", translation_es: 'No ordeno mi habitación.',
    words: ['Ik', 'ruim', 'mijn', 'kamer', 'op'], negator: 'niet', mode: 'insert', position: 4,
    explanation: 'niet sits before the separable prefix "op", which stays at the very end.',
    explanation_es: 'niet va delante del prefijo separable "op", que permanece al final.', level: 'B1' },

  // ── niet: before an infinitive (modal verb) ────────────────────────────────
  { id: 'neg-niet-gaan', english: "I don't want to go.", translation_es: 'No quiero ir.',
    words: ['Ik', 'wil', 'gaan'], negator: 'niet', mode: 'insert', position: 2,
    explanation: 'niet comes before the infinitive that closes the clause: wil niet gaan.',
    explanation_es: 'niet va delante del infinitivo que cierra la oración: wil niet gaan.', level: 'A2' },
  { id: 'neg-niet-komen', english: "She can't come.", translation_es: 'Ella no puede venir.',
    words: ['Zij', 'kan', 'komen'], negator: 'niet', mode: 'insert', position: 2,
    explanation: 'The infinitive "komen" stays at the end; niet goes right in front of it.',
    explanation_es: 'El infinitivo "komen" queda al final; niet va justo delante.', level: 'A2' },

  // ── niet: before a past participle (perfect tense) ─────────────────────────
  { id: 'neg-niet-gewerkt', english: "I haven't worked.", translation_es: 'No he trabajado.',
    words: ['Ik', 'heb', 'gewerkt'], negator: 'niet', mode: 'insert', position: 2,
    explanation: 'In the perfect tense, niet comes before the past participle: heb niet gewerkt.',
    explanation_es: 'En el pretérito perfecto, niet va delante del participio: heb niet gewerkt.', level: 'B1' },
  { id: 'neg-niet-gebeld', english: "He hasn't called.", translation_es: 'Él no ha llamado.',
    words: ['Hij', 'heeft', 'gebeld'], negator: 'niet', mode: 'insert', position: 2,
    explanation: 'The past participle "gebeld" closes the clause; niet goes just before it.',
    explanation_es: 'El participio "gebeld" cierra la oración; niet va justo delante.', level: 'B1' },

  // ── niet: before a possessive-determined (definite) noun phrase ────────────
  { id: 'neg-niet-mijn-boek', english: "That isn't my book.", translation_es: 'Ese no es mi libro.',
    words: ['Dat', 'is', 'mijn', 'boek'], negator: 'niet', mode: 'insert', position: 2,
    explanation: '"mijn boek" is definite (possessive), so it takes niet — placed before the noun phrase it negates.',
    explanation_es: '"mijn boek" es definido (posesivo), así que lleva niet — delante del sintagma que niega.', level: 'B1' },
];

async function main() {
  console.log(`Inserting ${rows.length} negation exercises…`);
  const { error } = await supabase.from('negation_exercises').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Done.');
}

main();
