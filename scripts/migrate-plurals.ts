import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: fetch as typeof fetch }, realtime: { transport: ws } }
);

const rows = [
  // ── A1 ───────────────────────────────────────────────────────────────────
  // -en: simple
  { id: 'pn-hond',   singular: 'hond',   article: 'de',  plural: 'honden',   plural_type: 'en',        english: 'dog',            translation_es: 'perro',          tip: 'Most nouns add -en for their plural.',                                      tip_es: 'La mayoría de los sustantivos añaden -en para el plural.',                           level: 'A1' },
  { id: 'pn-stoel',  singular: 'stoel',  article: 'de',  plural: 'stoelen',  plural_type: 'en',        english: 'chair',          translation_es: 'silla',          tip: 'Most nouns add -en for their plural.',                                      tip_es: 'La mayoría de los sustantivos añaden -en para el plural.',                           level: 'A1' },
  { id: 'pn-dier',   singular: 'dier',   article: 'het', plural: 'dieren',   plural_type: 'en',        english: 'animal',         translation_es: 'animal',         tip: 'Most nouns add -en for their plural.',                                      tip_es: 'La mayoría de los sustantivos añaden -en para el plural.',                           level: 'A1' },
  { id: 'pn-deur',   singular: 'deur',   article: 'de',  plural: 'deuren',   plural_type: 'en',        english: 'door',           translation_es: 'puerta',         tip: 'Most nouns add -en for their plural.',                                      tip_es: 'La mayoría de los sustantivos añaden -en para el plural.',                           level: 'A1' },
  // -en: short vowel → double consonant
  { id: 'pn-man',    singular: 'man',    article: 'de',  plural: 'mannen',   plural_type: 'en',        english: 'man',            translation_es: 'hombre',         tip: 'Short vowel + single consonant: double the consonant before -en.',         tip_es: 'Vocal corta + consonante única: duplica la consonante antes de -en.',                level: 'A1' },
  { id: 'pn-kat',    singular: 'kat',    article: 'de',  plural: 'katten',   plural_type: 'en',        english: 'cat',            translation_es: 'gato',           tip: 'Short vowel + single consonant: double the consonant before -en.',         tip_es: 'Vocal corta + consonante única: duplica la consonante antes de -en.',                level: 'A1' },
  { id: 'pn-bed',    singular: 'bed',    article: 'het', plural: 'bedden',   plural_type: 'en',        english: 'bed',            translation_es: 'cama',           tip: 'Short vowel + single consonant: double the consonant before -en.',         tip_es: 'Vocal corta + consonante única: duplica la consonante antes de -en.',                level: 'A1' },
  { id: 'pn-bus',    singular: 'bus',    article: 'de',  plural: 'bussen',   plural_type: 'en',        english: 'bus',            translation_es: 'autobús',        tip: 'Short vowel + single consonant: double the consonant before -en.',         tip_es: 'Vocal corta + consonante única: duplica la consonante antes de -en.',                level: 'A1' },
  // -en: long vowel spelling changes
  { id: 'pn-dag',    singular: 'dag',    article: 'de',  plural: 'dagen',    plural_type: 'en',        english: 'day',            translation_es: 'día',            tip: 'The short vowel opens in the open syllable before -en (dag → da-gen).',   tip_es: 'La vocal corta se abre en sílaba abierta antes de -en (dag → da-gen).',             level: 'A1' },
  { id: 'pn-boom',   singular: 'boom',   article: 'de',  plural: 'bomen',    plural_type: 'en',        english: 'tree',           translation_es: 'árbol',          tip: 'Long vowels shorten in spelling before -en when the syllable opens (oo → o).', tip_es: 'Las vocales largas se acortan en la escritura antes de -en (oo → o).',           level: 'A1' },
  // -en: consonant alternation
  { id: 'pn-huis',   singular: 'huis',   article: 'het', plural: 'huizen',   plural_type: 'en',        english: 'house',          translation_es: 'casa',           tip: 'Final -s changes to -z before -en (huis → huizen).',                       tip_es: 'La -s final cambia a -z antes de -en (huis → huizen).',                             level: 'A1' },
  { id: 'pn-brief',  singular: 'brief',  article: 'de',  plural: 'brieven',  plural_type: 'en',        english: 'letter',         translation_es: 'carta',          tip: 'Final -f changes to -v before -en (brief → brieven).',                     tip_es: 'La -f final cambia a -v antes de -en (brief → brieven).',                           level: 'A1' },
  // -eren
  { id: 'pn-kind',   singular: 'kind',   article: 'het', plural: 'kinderen', plural_type: 'eren',      english: 'child',          translation_es: 'niño / niña',    tip: 'A small group of nouns take -eren as their plural.',                       tip_es: 'Un pequeño grupo de sustantivos usa -eren como plural.',                             level: 'A1' },
  // -s: unstressed -el
  { id: 'pn-tafel',  singular: 'tafel',  article: 'de',  plural: 'tafels',   plural_type: 's',         english: 'table',          translation_es: 'mesa',           tip: 'Nouns ending in unstressed -el take -s as their plural.',                  tip_es: 'Los sustantivos terminados en -el átono usan -s como plural.',                       level: 'A1' },
  { id: 'pn-winkel', singular: 'winkel', article: 'de',  plural: 'winkels',  plural_type: 's',         english: 'shop',           translation_es: 'tienda',         tip: 'Nouns ending in unstressed -el take -s as their plural.',                  tip_es: 'Los sustantivos terminados en -el átono usan -s como plural.',                       level: 'A1' },
  { id: 'pn-vogel',  singular: 'vogel',  article: 'de',  plural: 'vogels',   plural_type: 's',         english: 'bird',           translation_es: 'pájaro',         tip: 'Nouns ending in unstressed -el take -s as their plural.',                  tip_es: 'Los sustantivos terminados en -el átono usan -s como plural.',                       level: 'A1' },
  // -s: unstressed -er
  { id: 'pn-kamer',  singular: 'kamer',  article: 'de',  plural: 'kamers',   plural_type: 's',         english: 'room',           translation_es: 'habitación',     tip: 'Nouns ending in unstressed -er take -s as their plural.',                  tip_es: 'Los sustantivos terminados en -er átono usan -s como plural.',                       level: 'A1' },
  // -s: unstressed -en
  { id: 'pn-jongen', singular: 'jongen', article: 'de',  plural: 'jongens',  plural_type: 's',         english: 'boy',            translation_es: 'chico',          tip: 'Nouns ending in unstressed -en take -s as their plural.',                  tip_es: 'Los sustantivos terminados en -en átono usan -s como plural.',                       level: 'A1' },
  // -s: diminutive -je
  { id: 'pn-meisje', singular: 'meisje', article: 'het', plural: 'meisjes',  plural_type: 's',         english: 'girl',           translation_es: 'chica',          tip: 'All diminutives (-je) take -s as their plural.',                          tip_es: 'Todos los diminutivos (-je) usan -s como plural.',                                   level: 'A1' },
  // -s: foreign vowel ending
  { id: 'pn-auto',   singular: 'auto',   article: 'de',  plural: "auto's",   plural_type: 's',         english: 'car',            translation_es: 'coche',          tip: "Nouns ending in -o, -u, -a, or -i take -'s as their plural.",             tip_es: "Los sustantivos terminados en -o, -u, -a o -i usan -'s como plural.",               level: 'A1' },

  // ── A2 ───────────────────────────────────────────────────────────────────
  // -en: aa → a
  { id: 'pn-maan',   singular: 'maan',   article: 'de',  plural: 'manen',    plural_type: 'en',        english: 'moon',           translation_es: 'luna',           tip: 'Long vowels shorten in spelling before -en (aa → a).',                     tip_es: 'Las vocales largas se acortan en la escritura antes de -en (aa → a).',               level: 'A2' },
  { id: 'pn-jaar',   singular: 'jaar',   article: 'het', plural: 'jaren',    plural_type: 'en',        english: 'year',           translation_es: 'año',            tip: 'Long vowels shorten in spelling before -en (aa → a).',                     tip_es: 'Las vocales largas se acortan en la escritura antes de -en (aa → a).',               level: 'A2' },
  { id: 'pn-naam',   singular: 'naam',   article: 'de',  plural: 'namen',    plural_type: 'en',        english: 'name',           translation_es: 'nombre',         tip: 'Long vowels shorten in spelling before -en (aa → a).',                     tip_es: 'Las vocales largas se acortan en la escritura antes de -en (aa → a).',               level: 'A2' },
  { id: 'pn-taal',   singular: 'taal',   article: 'de',  plural: 'talen',    plural_type: 'en',        english: 'language',       translation_es: 'idioma',         tip: 'Long vowels shorten in spelling before -en (aa → a).',                     tip_es: 'Las vocales largas se acortan en la escritura antes de -en (aa → a).',               level: 'A2' },
  { id: 'pn-straat', singular: 'straat', article: 'de',  plural: 'straten',  plural_type: 'en',        english: 'street',         translation_es: 'calle',          tip: 'Long vowels shorten in spelling before -en (aa → a).',                     tip_es: 'Las vocales largas se acortan en la escritura antes de -en (aa → a).',               level: 'A2' },
  // -en: oo → o
  { id: 'pn-school', singular: 'school', article: 'de',  plural: 'scholen',  plural_type: 'en',        english: 'school',         translation_es: 'colegio',        tip: 'Long vowels shorten in spelling before -en (oo → o).',                     tip_es: 'Las vocales largas se acortan en la escritura antes de -en (oo → o).',               level: 'A2' },
  { id: 'pn-boot',   singular: 'boot',   article: 'de',  plural: 'boten',    plural_type: 'en',        english: 'boat',           translation_es: 'barco',          tip: 'Long vowels shorten in spelling before -en (oo → o).',                     tip_es: 'Las vocales largas se acortan en la escritura antes de -en (oo → o).',               level: 'A2' },
  // -en: uu → u
  { id: 'pn-muur',   singular: 'muur',   article: 'de',  plural: 'muren',    plural_type: 'en',        english: 'wall',           translation_es: 'pared',          tip: 'Long vowels shorten in spelling before -en (uu → u).',                     tip_es: 'Las vocales largas se acortan en la escritura antes de -en (uu → u).',               level: 'A2' },
  // -en: s → z
  { id: 'pn-roos',   singular: 'roos',   article: 'de',  plural: 'rozen',    plural_type: 'en',        english: 'rose',           translation_es: 'rosa',           tip: 'Final -s changes to -z before -en, and the long vowel shortens (oo → o).',  tip_es: 'La -s final cambia a -z antes de -en, y la vocal larga se acorta (oo → o).',        level: 'A2' },
  // -en: vowel lengthens / opens
  { id: 'pn-weg',    singular: 'weg',    article: 'de',  plural: 'wegen',    plural_type: 'en',        english: 'road / way',     translation_es: 'camino / carretera', tip: 'The short vowel opens in the open syllable before -en (we-gen).',      tip_es: 'La vocal corta se abre en sílaba abierta antes de -en (we-gen).',                   level: 'A2' },
  // -en: f → v
  { id: 'pn-dief',   singular: 'dief',   article: 'de',  plural: 'dieven',   plural_type: 'en',        english: 'thief',          translation_es: 'ladrón',         tip: 'Final -f changes to -v before -en (dief → dieven).',                      tip_es: 'La -f final cambia a -v antes de -en (dief → dieven).',                             level: 'A2' },
  // -en: short vowel doubling
  { id: 'pn-kop',    singular: 'kop',    article: 'de',  plural: 'koppen',   plural_type: 'en',        english: 'cup / head',     translation_es: 'taza / cabeza',  tip: 'Short vowel + single consonant: double the consonant before -en.',         tip_es: 'Vocal corta + consonante única: duplica la consonante antes de -en.',                level: 'A2' },
  { id: 'pn-pan',    singular: 'pan',    article: 'de',  plural: 'pannen',   plural_type: 'en',        english: 'pan',            translation_es: 'sartén',         tip: 'Short vowel + single consonant: double the consonant before -en.',         tip_es: 'Vocal corta + consonante única: duplica la consonante antes de -en.',                level: 'A2' },
  { id: 'pn-les',    singular: 'les',    article: 'de',  plural: 'lessen',   plural_type: 'en',        english: 'lesson',         translation_es: 'clase',          tip: 'Short vowel + single consonant: double the consonant before -en.',         tip_es: 'Vocal corta + consonante única: duplica la consonante antes de -en.',                level: 'A2' },
  // -en: simple
  { id: 'pn-nacht',  singular: 'nacht',  article: 'de',  plural: 'nachten',  plural_type: 'en',        english: 'night',          translation_es: 'noche',          tip: 'Most nouns add -en for their plural.',                                     tip_es: 'La mayoría de los sustantivos añaden -en para el plural.',                           level: 'A2' },
  { id: 'pn-maand',  singular: 'maand',  article: 'de',  plural: 'maanden',  plural_type: 'en',        english: 'month',          translation_es: 'mes',            tip: 'Most nouns add -en for their plural.',                                     tip_es: 'La mayoría de los sustantivos añaden -en para el plural.',                           level: 'A2' },
  { id: 'pn-bloem',  singular: 'bloem',  article: 'de',  plural: 'bloemen',  plural_type: 'en',        english: 'flower',         translation_es: 'flor',           tip: 'Most nouns add -en for their plural.',                                     tip_es: 'La mayoría de los sustantivos añaden -en para el plural.',                           level: 'A2' },
  { id: 'pn-groep',  singular: 'groep',  article: 'de',  plural: 'groepen',  plural_type: 'en',        english: 'group',          translation_es: 'grupo',          tip: 'Most nouns add -en for their plural.',                                     tip_es: 'La mayoría de los sustantivos añaden -en para el plural.',                           level: 'A2' },
  { id: 'pn-kleur',  singular: 'kleur',  article: 'de',  plural: 'kleuren',  plural_type: 'en',        english: 'colour',         translation_es: 'color',          tip: 'Most nouns add -en for their plural.',                                     tip_es: 'La mayoría de los sustantivos añaden -en para el plural.',                           level: 'A2' },
  // -s: unstressed -el
  { id: 'pn-lepel',  singular: 'lepel',  article: 'de',  plural: 'lepels',   plural_type: 's',         english: 'spoon',          translation_es: 'cuchara',        tip: 'Nouns ending in unstressed -el take -s as their plural.',                  tip_es: 'Los sustantivos terminados en -el átono usan -s como plural.',                       level: 'A2' },
  { id: 'pn-sleutel',singular: 'sleutel',article: 'de',  plural: 'sleutels', plural_type: 's',         english: 'key',            translation_es: 'llave',          tip: 'Nouns ending in unstressed -el take -s as their plural.',                  tip_es: 'Los sustantivos terminados en -el átono usan -s como plural.',                       level: 'A2' },
  { id: 'pn-wortel', singular: 'wortel', article: 'de',  plural: 'wortels',  plural_type: 's',         english: 'carrot',         translation_es: 'zanahoria',      tip: 'Nouns ending in unstressed -el take -s as their plural.',                  tip_es: 'Los sustantivos terminados en -el átono usan -s como plural.',                       level: 'A2' },
  { id: 'pn-appel',  singular: 'appel',  article: 'de',  plural: 'appels',   plural_type: 's',         english: 'apple',          translation_es: 'manzana',        tip: 'Nouns ending in unstressed -el take -s as their plural.',                  tip_es: 'Los sustantivos terminados en -el átono usan -s como plural.',                       level: 'A2' },
  // -s: unstressed -er
  { id: 'pn-dokter', singular: 'dokter', article: 'de',  plural: 'dokters',  plural_type: 's',         english: 'doctor',         translation_es: 'médico',         tip: 'Nouns ending in unstressed -er take -s as their plural.',                  tip_es: 'Los sustantivos terminados en -er átono usan -s como plural.',                       level: 'A2' },
  { id: 'pn-nummer', singular: 'nummer', article: 'het', plural: 'nummers',  plural_type: 's',         english: 'number',         translation_es: 'número',         tip: 'Nouns ending in unstressed -er take -s as their plural.',                  tip_es: 'Los sustantivos terminados en -er átono usan -s como plural.',                       level: 'A2' },
  // -s: foreign vowel ending
  { id: 'pn-foto',   singular: 'foto',   article: 'de',  plural: "foto's",   plural_type: 's',         english: 'photo',          translation_es: 'foto',           tip: "Nouns ending in -o, -u, -a, or -i take -'s as their plural.",             tip_es: "Los sustantivos terminados en -o, -u, -a o -i usan -'s como plural.",               level: 'A2' },
  // -eren
  { id: 'pn-ei',     singular: 'ei',     article: 'het', plural: 'eieren',   plural_type: 'eren',      english: 'egg',            translation_es: 'huevo',          tip: 'A small group of nouns take -eren as their plural.',                       tip_es: 'Un pequeño grupo de sustantivos usa -eren como plural.',                             level: 'A2' },
  { id: 'pn-blad',   singular: 'blad',   article: 'het', plural: 'bladeren', plural_type: 'eren',      english: 'leaf / page',    translation_es: 'hoja',           tip: 'A small group of nouns take -eren as their plural.',                       tip_es: 'Un pequeño grupo de sustantivos usa -eren como plural.',                             level: 'A2' },
  // irregular
  { id: 'pn-stad',   singular: 'stad',   article: 'de',  plural: 'steden',   plural_type: 'irregular', english: 'city',           translation_es: 'ciudad',         tip: 'Irregular plural: the vowel changes from a to e (stad → steden).',         tip_es: 'Plural irregular: la vocal cambia de a a e (stad → steden).',                        level: 'A2' },
  { id: 'pn-schip',  singular: 'schip',  article: 'het', plural: 'schepen',  plural_type: 'irregular', english: 'ship',           translation_es: 'barco / buque',  tip: 'Irregular plural: the vowel changes from i to e (schip → schepen).',       tip_es: 'Plural irregular: la vocal cambia de i a e (schip → schepen).',                      level: 'A2' },

  // ── B1 ───────────────────────────────────────────────────────────────────
  // -en: short vowel doubling
  { id: 'pn-brug',   singular: 'brug',   article: 'de',  plural: 'bruggen',  plural_type: 'en',        english: 'bridge',         translation_es: 'puente',         tip: 'Short vowel + single consonant: double the consonant before -en.',         tip_es: 'Vocal corta + consonante única: duplica la consonante antes de -en.',                level: 'B1' },
  { id: 'pn-wet',    singular: 'wet',    article: 'de',  plural: 'wetten',   plural_type: 'en',        english: 'law',            translation_es: 'ley',            tip: 'Short vowel + single consonant: double the consonant before -en.',         tip_es: 'Vocal corta + consonante única: duplica la consonante antes de -en.',                level: 'B1' },
  // -en: s → z
  { id: 'pn-prijs',  singular: 'prijs',  article: 'de',  plural: 'prijzen',  plural_type: 'en',        english: 'price / prize',  translation_es: 'precio / premio',tip: 'Final -s changes to -z before -en (prijs → prijzen).',                     tip_es: 'La -s final cambia a -z antes de -en (prijs → prijzen).',                           level: 'B1' },
  { id: 'pn-reis',   singular: 'reis',   article: 'de',  plural: 'reizen',   plural_type: 'en',        english: 'journey / trip', translation_es: 'viaje',          tip: 'Final -s changes to -z before -en (reis → reizen).',                       tip_es: 'La -s final cambia a -z antes de -en (reis → reizen).',                             level: 'B1' },
  // -en: oo → o
  { id: 'pn-droom',  singular: 'droom',  article: 'de',  plural: 'dromen',   plural_type: 'en',        english: 'dream',          translation_es: 'sueño',          tip: 'Long vowels shorten in spelling before -en (oo → o).',                     tip_es: 'Las vocales largas se acortan en la escritura antes de -en (oo → o).',               level: 'B1' },
  // -en: aa → a
  { id: 'pn-taak',   singular: 'taak',   article: 'de',  plural: 'taken',    plural_type: 'en',        english: 'task',           translation_es: 'tarea',          tip: 'Long vowels shorten in spelling before -en (aa → a).',                     tip_es: 'Las vocales largas se acortan en la escritura antes de -en (aa → a).',               level: 'B1' },
  // -en: ee → e
  { id: 'pn-probleem',singular:'probleem',article:'het', plural: 'problemen',plural_type: 'en',        english: 'problem',        translation_es: 'problema',       tip: 'Long vowels shorten in spelling before -en (ee → e).',                     tip_es: 'Las vocales largas se acortan en la escritura antes de -en (ee → e).',               level: 'B1' },
  // -en: simple
  { id: 'pn-vlieg',  singular: 'vlieg',  article: 'de',  plural: 'vliegen',  plural_type: 'en',        english: 'fly (insect)',   translation_es: 'mosca',          tip: 'Most nouns add -en for their plural.',                                     tip_es: 'La mayoría de los sustantivos añaden -en para el plural.',                           level: 'B1' },
  { id: 'pn-student',singular: 'student',article: 'de',  plural: 'studenten',plural_type: 'en',        english: 'student',        translation_es: 'estudiante',     tip: 'Most nouns add -en for their plural.',                                     tip_es: 'La mayoría de los sustantivos añaden -en para el plural.',                           level: 'B1' },
  { id: 'pn-moment', singular: 'moment', article: 'het', plural: 'momenten', plural_type: 'en',        english: 'moment',         translation_es: 'momento',        tip: 'Most nouns add -en for their plural.',                                     tip_es: 'La mayoría de los sustantivos añaden -en para el plural.',                           level: 'B1' },
  // -en: -heid → -heden
  { id: 'pn-vrijheid',singular:'vrijheid',article:'de',  plural: 'vrijheden',plural_type: 'en',        english: 'freedom',        translation_es: 'libertad',       tip: 'Nouns ending in -heid form their plural with -heden (ei → e).',            tip_es: 'Los sustantivos terminados en -heid forman el plural con -heden (ei → e).',          level: 'B1' },
  { id: 'pn-mogelijkheid',singular:'mogelijkheid',article:'de',plural:'mogelijkheden',plural_type:'en',english:'possibility',translation_es:'posibilidad',          tip: 'Nouns ending in -heid form their plural with -heden (ei → e).',            tip_es: 'Los sustantivos terminados en -heid forman el plural con -heden (ei → e).',          level: 'B1' },
  // -en: -ing → -ingen
  { id: 'pn-oefening',singular:'oefening',article:'de', plural:'oefeningen',plural_type: 'en',        english: 'exercise',       translation_es: 'ejercicio',      tip: 'Nouns ending in -ing add -en for their plural (oefening → oefeningen).',   tip_es: 'Los sustantivos terminados en -ing añaden -en para el plural.',                      level: 'B1' },
  { id: 'pn-vergadering',singular:'vergadering',article:'de',plural:'vergaderingen',plural_type:'en',english:'meeting',translation_es:'reunión',                    tip: 'Nouns ending in -ing add -en for their plural.',                           tip_es: 'Los sustantivos terminados en -ing añaden -en para el plural.',                      level: 'B1' },
  // -s: unstressed -er
  { id: 'pn-computer',singular:'computer',article:'de', plural: 'computers', plural_type: 's',        english: 'computer',       translation_es: 'ordenador',      tip: 'Nouns ending in unstressed -er take -s as their plural.',                  tip_es: 'Los sustantivos terminados en -er átono usan -s como plural.',                       level: 'B1' },
  // -s: borrowed words
  { id: 'pn-tram',   singular: 'tram',   article: 'de',  plural: 'trams',    plural_type: 's',         english: 'tram',           translation_es: 'tranvía',        tip: 'Many borrowed words form their plural with -s.',                           tip_es: 'Muchos préstamos del extranjero usan -s como plural.',                               level: 'B1' },
  { id: 'pn-film',   singular: 'film',   article: 'de',  plural: 'films',    plural_type: 's',         english: 'film',           translation_es: 'película',       tip: 'Many borrowed words form their plural with -s.',                           tip_es: 'Muchos préstamos del extranjero usan -s como plural.',                               level: 'B1' },
  // -s: foreign vowel ending
  { id: 'pn-menu',   singular: 'menu',   article: 'het', plural: "menu's",   plural_type: 's',         english: 'menu',           translation_es: 'menú',           tip: "Nouns ending in -o, -u, -a, or -i take -'s as their plural.",             tip_es: "Los sustantivos terminados en -o, -u, -a o -i usan -'s como plural.",               level: 'B1' },
  // -eren
  { id: 'pn-lied',   singular: 'lied',   article: 'het', plural: 'liederen', plural_type: 'eren',      english: 'song',           translation_es: 'canción',        tip: 'A small group of nouns take -eren as their plural.',                       tip_es: 'Un pequeño grupo de sustantivos usa -eren como plural.',                             level: 'B1' },
  // irregular
  { id: 'pn-lid',    singular: 'lid',    article: 'het', plural: 'leden',    plural_type: 'irregular', english: 'member',         translation_es: 'miembro',        tip: 'Irregular plural: the vowel changes from i to e (lid → leden).',           tip_es: 'Plural irregular: la vocal cambia de i a e (lid → leden).',                          level: 'B1' },
];

async function main() {
  console.log(`Inserting ${rows.length} plural nouns…`);
  const { error } = await supabase.from('plural_nouns').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Done.');
}

main();
