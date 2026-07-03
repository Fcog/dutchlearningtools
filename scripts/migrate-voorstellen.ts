import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: fetch as typeof fetch }, realtime: { transport: ws } }
);

// Gap-fill for the separable verb `voorstellen`. The blanks are always the
// disambiguating cue: the reflexive pronoun (me/je/zich/ons — which changes
// with the subject) and/or the split verb (stel/stelt/stellen … voor). The
// bank mixes the answer words with tempting distractors (the wrong pronoun for
// the subject, or a reflexive pronoun where none is needed).
const rows = [
  // ── introduce someone: iemand aan iemand voorstellen (no reflexive) ────────
  { id: 'vst-introduce-ik', english: "I'll introduce my colleague to you.", translation_es: 'Te presento a mi colega.',
    dutch: 'Ik stel mijn collega aan je voor.', gapped: 'Ik ___ mijn collega aan je ___.',
    answers: ['stel', 'voor'], bank: ['stel', 'stelt', 'voor', 'me', 'voorstellen'], meaning: 'introduce',
    explanation: 'No reflexive pronoun + an object + "aan …" → to introduce someone. With "ik" the stem is "stel".',
    explanation_es: 'Sin pronombre reflexivo + objeto + "aan …" → presentar a alguien. Con "ik" el radical es "stel".', level: 'A2' },
  { id: 'vst-introduce-wij', english: 'We introduce our new neighbours to the family.', translation_es: 'Presentamos a nuestros nuevos vecinos a la familia.',
    dutch: 'Wij stellen onze nieuwe buren aan de familie voor.', gapped: 'Wij ___ onze nieuwe buren aan de familie ___.',
    answers: ['stellen', 'voor'], bank: ['stellen', 'stelt', 'voor', 'ons', 'voorstellen'], meaning: 'introduce',
    explanation: 'Introducing others, not ourselves — no reflexive. Plural subject "wij" → "stellen".',
    explanation_es: 'Presentamos a otros, no a nosotros — sin reflexivo. Sujeto plural "wij" → "stellen".', level: 'A2' },
  { id: 'vst-introduce-hij', english: 'He introduces his girlfriend to his parents.', translation_es: 'Presenta a su novia a sus padres.',
    dutch: 'Hij stelt zijn vriendin aan zijn ouders voor.', gapped: 'Hij ___ zijn vriendin aan zijn ouders ___.',
    answers: ['stelt', 'voor'], bank: ['stelt', 'stel', 'voor', 'zich', 'voorstellen'], meaning: 'introduce',
    explanation: 'An object ("zijn vriendin") + "aan …" → introduce someone. "zich" is a distractor: he is not introducing himself.',
    explanation_es: 'Objeto ("zijn vriendin") + "aan …" → presentar a alguien. "zich" es un distractor: no se presenta a sí mismo.', level: 'A2' },

  // ── introduce oneself: zich voorstellen (reflexive, no object) ─────────────
  { id: 'vst-self-ik', english: 'May I introduce myself? I am Sanne.', translation_es: '¿Puedo presentarme? Soy Sanne.',
    dutch: 'Mag ik me even voorstellen? Ik ben Sanne.', gapped: 'Mag ik ___ even ___? Ik ben Sanne.',
    answers: ['me', 'voorstellen'], bank: ['me', 'je', 'zich', 'ons', 'voorstellen'], meaning: 'introduce_self',
    explanation: 'Reflexive pronoun with no other object → introduce oneself. "ik" takes "me"; after the modal "mag" the verb stays as the infinitive "voorstellen".',
    explanation_es: 'Pronombre reflexivo sin otro objeto → presentarse. "ik" lleva "me"; tras el modal "mag" el verbo queda como infinitivo "voorstellen".', level: 'A1' },
  { id: 'vst-self-jij', english: 'Can you introduce yourself to the group?', translation_es: '¿Puedes presentarte al grupo?',
    dutch: 'Kun je je even voorstellen aan de groep?', gapped: 'Kun je ___ even ___ aan de groep?',
    answers: ['je', 'voorstellen'], bank: ['je', 'me', 'zich', 'ons', 'voorstellen'], meaning: 'introduce_self',
    explanation: 'Introducing yourself → reflexive. The subject "je/jij" takes the reflexive "je".',
    explanation_es: 'Presentarte a ti mismo → reflexivo. El sujeto "je/jij" lleva el reflexivo "je".', level: 'A2' },
  { id: 'vst-self-u', english: 'Would you introduce yourself, please?', translation_es: '¿Podría presentarse, por favor?',
    dutch: 'Wilt u zich even voorstellen?', gapped: 'Wilt u ___ even ___?',
    answers: ['zich', 'voorstellen'], bank: ['zich', 'me', 'je', 'ons', 'voorstellen'], meaning: 'introduce_self',
    explanation: 'Formal "u" takes the reflexive "zich". No object → introduce oneself.',
    explanation_es: 'El formal "u" lleva el reflexivo "zich". Sin objeto → presentarse.', level: 'A2' },
  { id: 'vst-self-wij', english: 'We would like to introduce ourselves.', translation_es: 'Nos gustaría presentarnos.',
    dutch: 'Wij willen ons graag voorstellen.', gapped: 'Wij willen ___ graag ___.',
    answers: ['ons', 'voorstellen'], bank: ['ons', 'me', 'je', 'zich', 'voorstellen'], meaning: 'introduce_self',
    explanation: 'Subject "wij" takes the reflexive "ons". After the modal "willen" the verb is the infinitive "voorstellen".',
    explanation_es: 'El sujeto "wij" lleva el reflexivo "ons". Tras el modal "willen" el verbo es el infinitivo "voorstellen".', level: 'A2' },

  // ── imagine: zich iets voorstellen (reflexive + object) ────────────────────
  { id: 'vst-imagine-ik', english: 'I can imagine that well.', translation_es: 'Me lo puedo imaginar bien.',
    dutch: 'Ik kan me dat goed voorstellen.', gapped: 'Ik kan ___ dat goed ___.',
    answers: ['me', 'voorstellen'], bank: ['me', 'je', 'zich', 'ons', 'voorstellen'], meaning: 'imagine',
    explanation: 'Reflexive pronoun ("me") together with an object ("dat") → to imagine. Subject "ik" → "me".',
    explanation_es: 'Pronombre reflexivo ("me") junto a un objeto ("dat") → imaginar. Sujeto "ik" → "me".', level: 'B1' },
  { id: 'vst-imagine-imperative', english: 'Imagine: you win the lottery!', translation_es: '¡Imagínate: ganas la lotería!',
    dutch: 'Stel je voor: je wint de loterij!', gapped: '___ ___ ___: je wint de loterij!',
    answers: ['Stel', 'je', 'voor'], bank: ['Stel', 'je', 'voor', 'me', 'stelt'], meaning: 'imagine',
    explanation: '"Stel je voor!" is the fixed imperative for "imagine!". The split verb "stel … voor" wraps the reflexive "je".',
    explanation_es: '"Stel je voor!" es el imperativo fijo de "¡imagínate!". El verbo separable "stel … voor" rodea el reflexivo "je".', level: 'A2' },
  { id: 'vst-imagine-hij', english: "He can't imagine how cold it is there.", translation_es: 'No puede imaginarse lo frío que hace allí.',
    dutch: 'Hij kan zich niet voorstellen hoe koud het daar is.', gapped: 'Hij kan ___ niet ___ hoe koud het daar is.',
    answers: ['zich', 'voorstellen'], bank: ['zich', 'me', 'je', 'ons', 'voorstellen'], meaning: 'imagine',
    explanation: 'Reflexive + a clause as object → to imagine. Subject "hij" → "zich".',
    explanation_es: 'Reflexivo + una oración como objeto → imaginar. Sujeto "hij" → "zich".', level: 'B1' },
  { id: 'vst-imagine-wij', english: 'We can well imagine how tired you are.', translation_es: 'Nos imaginamos bien lo cansado que estás.',
    dutch: 'Wij kunnen ons goed voorstellen hoe moe je bent.', gapped: 'Wij kunnen ___ goed ___ hoe moe je bent.',
    answers: ['ons', 'voorstellen'], bank: ['ons', 'me', 'je', 'zich', 'voorstellen'], meaning: 'imagine',
    explanation: 'Reflexive + object clause → to imagine. Subject "wij" → "ons".',
    explanation_es: 'Reflexivo + oración objeto → imaginar. Sujeto "wij" → "ons".', level: 'B1' },

  // ── suggest / propose: voorstellen (dat/om …), no reflexive ────────────────
  { id: 'vst-suggest-ik', english: 'I suggest that we start tomorrow.', translation_es: 'Propongo que empecemos mañana.',
    dutch: 'Ik stel voor dat we morgen beginnen.', gapped: 'Ik ___ ___ dat we morgen beginnen.',
    answers: ['stel', 'voor'], bank: ['stel', 'stelt', 'voor', 'me', 'voorstellen'], meaning: 'suggest',
    explanation: 'No reflexive + "dat …" → to suggest / propose. "me" is a distractor: you are not introducing or imagining yourself.',
    explanation_es: 'Sin reflexivo + "dat …" → proponer. "me" es un distractor: no te presentas ni te imaginas.', level: 'A2' },
  { id: 'vst-suggest-hij', english: 'He suggests travelling together.', translation_es: 'Propone viajar juntos.',
    dutch: 'Hij stelt voor om samen te reizen.', gapped: 'Hij ___ ___ om samen te reizen.',
    answers: ['stelt', 'voor'], bank: ['stelt', 'stel', 'voor', 'zich', 'voorstellen'], meaning: 'suggest',
    explanation: 'No reflexive + "om … te …" → to propose. Subject "hij" → "stelt".',
    explanation_es: 'Sin reflexivo + "om … te …" → proponer. Sujeto "hij" → "stelt".', level: 'B1' },
  { id: 'vst-suggest-zij', english: 'They propose a different approach.', translation_es: 'Proponen un enfoque distinto.',
    dutch: 'Zij stellen een andere aanpak voor.', gapped: 'Zij ___ een andere aanpak ___.',
    answers: ['stellen', 'voor'], bank: ['stellen', 'stelt', 'voor', 'zich', 'voorstellen'], meaning: 'suggest',
    explanation: 'Proposing a thing ("een andere aanpak") → to suggest. Plural "zij" → "stellen".',
    explanation_es: 'Proponer algo ("een andere aanpak") → proponer. Plural "zij" → "stellen".', level: 'B1' },

  // ── represent / depict: iets stelt iets voor (thing as subject) ────────────
  { id: 'vst-represent-schilderij', english: 'What does this painting actually depict?', translation_es: '¿Qué representa en realidad este cuadro?',
    dutch: 'Wat stelt dit schilderij eigenlijk voor?', gapped: 'Wat ___ dit schilderij eigenlijk ___?',
    answers: ['stelt', 'voor'], bank: ['stelt', 'stellen', 'voor', 'zich', 'voorstellen'], meaning: 'represent',
    explanation: 'A thing is the subject ("dit schilderij") → to represent / depict. No reflexive.',
    explanation_es: 'El sujeto es una cosa ("dit schilderij") → representar. Sin reflexivo.', level: 'B1' },
  { id: 'vst-represent-tekening', english: 'This drawing depicts an old windmill.', translation_es: 'Este dibujo representa un viejo molino.',
    dutch: 'Deze tekening stelt een oude molen voor.', gapped: 'Deze tekening ___ een oude molen ___.',
    answers: ['stelt', 'voor'], bank: ['stelt', 'stellen', 'voor', 'zich', 'voorstellen'], meaning: 'represent',
    explanation: 'The subject is a thing ("deze tekening") → to depict. Singular → "stelt".',
    explanation_es: 'El sujeto es una cosa ("deze tekening") → representar. Singular → "stelt".', level: 'A2' },

  // ── amount to much: niet veel voorstellen (fixed idiom) ────────────────────
  { id: 'vst-worth-restaurant', english: "That restaurant isn't up to much.", translation_es: 'Ese restaurante no vale gran cosa.',
    dutch: 'Dat restaurant stelt niet veel voor.', gapped: 'Dat restaurant ___ niet veel ___.',
    answers: ['stelt', 'voor'], bank: ['stelt', 'stellen', 'voor', 'zich', 'voorstellen'], meaning: 'worth',
    explanation: '"niet veel voorstellen" = to not amount to much. Fixed idiom, no reflexive.',
    explanation_es: '"niet veel voorstellen" = no valer gran cosa. Expresión fija, sin reflexivo.', level: 'B1' },
  { id: 'vst-worth-baan', english: "His new job doesn't really amount to much.", translation_es: 'Su nuevo trabajo en realidad no es gran cosa.',
    dutch: 'Zijn nieuwe baan stelt eigenlijk niet zoveel voor.', gapped: 'Zijn nieuwe baan ___ eigenlijk niet zoveel ___.',
    answers: ['stelt', 'voor'], bank: ['stelt', 'stellen', 'voor', 'zich', 'voorstellen'], meaning: 'worth',
    explanation: 'The "niet (zo)veel voorstellen" idiom = to be worth little. Singular subject → "stelt".',
    explanation_es: 'La expresión "niet (zo)veel voorstellen" = valer poco. Sujeto singular → "stelt".', level: 'B1' },
];

async function main() {
  console.log(`Inserting ${rows.length} voorstellen exercises…`);
  const { error } = await supabase.from('voorstellen_exercises').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Done.');
}

main();
