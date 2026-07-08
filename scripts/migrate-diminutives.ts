import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: fetch as typeof fetch }, realtime: { transport: ws } }
);

// Dutch diminutives (verkleinwoorden). Prompt = "<noun> → ___"; the learner picks
// the correct diminutive from 4 forms. Distractors are the other plausible
// suffixes so the choice tests the rule. All diminutives are het-words.
const rows = [
  // ── -je: after most consonants (b d f g ch k p s t) ───────────────────────
  { id: 'dim-huis', dutch: 'huis → ___', english: 'house', translation_es: 'casa', answer: 'huisje', options: ['huisje', 'huistje', 'huisetje', 'huispje'], category: 'je', explanation: 'After most consonants the suffix is -je: huis → huisje.', explanation_es: 'Tras la mayoría de consonantes el sufijo es -je: huis → huisje.', level: 'A1' },
  { id: 'dim-boek', dutch: 'boek → ___', english: 'book', translation_es: 'libro', answer: 'boekje', options: ['boekje', 'boektje', 'boeketje', 'boekpje'], category: 'je', explanation: 'Ends in -k → -je: boek → boekje.', explanation_es: 'Termina en -k → -je: boek → boekje.', level: 'A1' },
  { id: 'dim-kat', dutch: 'kat → ___', english: 'cat', translation_es: 'gato', answer: 'katje', options: ['katje', 'kattje', 'katetje', 'katpje'], category: 'je', explanation: 'Ends in -t → -je: kat → katje.', explanation_es: 'Termina en -t → -je: kat → katje.', level: 'A1' },
  { id: 'dim-hond', dutch: 'hond → ___', english: 'dog', translation_es: 'perro', answer: 'hondje', options: ['hondje', 'hondtje', 'hondetje', 'hondpje'], category: 'je', explanation: 'Ends in -d → -je: hond → hondje.', explanation_es: 'Termina en -d → -je: hond → hondje.', level: 'A1' },
  { id: 'dim-schaap', dutch: 'schaap → ___', english: 'sheep', translation_es: 'oveja', answer: 'schaapje', options: ['schaapje', 'schaaptje', 'schaappje', 'schaapetje'], category: 'je', explanation: 'Ends in -p (long vowel) → -je: schaap → schaapje.', explanation_es: 'Termina en -p (vocal larga) → -je: schaap → schaapje.', level: 'A2' },
  { id: 'dim-zak', dutch: 'zak → ___', english: 'bag', translation_es: 'bolsa', answer: 'zakje', options: ['zakje', 'zaktje', 'zakketje', 'zakpje'], category: 'je', explanation: 'Ends in -k → -je: zak → zakje.', explanation_es: 'Termina en -k → -je: zak → zakje.', level: 'A2' },

  // ── -tje: after a vowel/diphthong, or l/n/r/w after a long vowel ───────────
  { id: 'dim-stoel', dutch: 'stoel → ___', english: 'chair', translation_es: 'silla', answer: 'stoeltje', options: ['stoeltje', 'stoelje', 'stoeletje', 'stoelpje'], category: 'tje', explanation: '-l after a long vowel → -tje: stoel → stoeltje.', explanation_es: '-l tras vocal larga → -tje: stoel → stoeltje.', level: 'A1' },
  { id: 'dim-deur', dutch: 'deur → ___', english: 'door', translation_es: 'puerta', answer: 'deurtje', options: ['deurtje', 'deurje', 'deuretje', 'deurkje'], category: 'tje', explanation: '-r after a long vowel → -tje: deur → deurtje.', explanation_es: '-r tras vocal larga → -tje: deur → deurtje.', level: 'A2' },
  { id: 'dim-schoen', dutch: 'schoen → ___', english: 'shoe', translation_es: 'zapato', answer: 'schoentje', options: ['schoentje', 'schoenje', 'schoenetje', 'schoenpje'], category: 'tje', explanation: '-n after a long vowel → -tje: schoen → schoentje.', explanation_es: '-n tras vocal larga → -tje: schoen → schoentje.', level: 'A2' },
  { id: 'dim-ei', dutch: 'ei → ___', english: 'egg', translation_es: 'huevo', answer: 'eitje', options: ['eitje', 'eije', 'eietje', 'eipje'], category: 'tje', explanation: 'After a diphthong (ei) → -tje: ei → eitje.', explanation_es: 'Tras un diptongo (ei) → -tje: ei → eitje.', level: 'A1' },
  { id: 'dim-koe', dutch: 'koe → ___', english: 'cow', translation_es: 'vaca', answer: 'koetje', options: ['koetje', 'koeje', 'koeetje', 'koepje'], category: 'tje', explanation: 'After a vowel → -tje: koe → koetje.', explanation_es: 'Tras una vocal → -tje: koe → koetje.', level: 'A2' },
  { id: 'dim-vrouw', dutch: 'vrouw → ___', english: 'woman', translation_es: 'mujer', answer: 'vrouwtje', options: ['vrouwtje', 'vrouwje', 'vrouwetje', 'vrouwpje'], category: 'tje', explanation: '-w after a diphthong → -tje: vrouw → vrouwtje.', explanation_es: '-w tras diptongo → -tje: vrouw → vrouwtje.', level: 'A2' },
  { id: 'dim-auto', dutch: 'auto → ___', english: 'car', translation_es: 'coche', answer: 'autootje', options: ['autootje', 'autotje', 'autoje', 'autopje'], category: 'tje', explanation: 'A word ending in a single stressed vowel doubles it + -tje: auto → autootje.', explanation_es: 'Palabra que acaba en vocal tónica: se dobla la vocal + -tje: auto → autootje.', level: 'B1' },

  // ── -etje: after l m n ng r preceded by a SHORT stressed vowel (double C) ──
  { id: 'dim-bal', dutch: 'bal → ___', english: 'ball', translation_es: 'pelota', answer: 'balletje', options: ['balletje', 'baltje', 'balje', 'balpje'], category: 'etje', explanation: 'Short vowel + l → double the l + -etje: bal → balletje.', explanation_es: 'Vocal corta + l → se dobla la l + -etje: bal → balletje.', level: 'A2' },
  { id: 'dim-man', dutch: 'man → ___', english: 'man', translation_es: 'hombre', answer: 'mannetje', options: ['mannetje', 'mantje', 'manje', 'manpje'], category: 'etje', explanation: 'Short vowel + n → double the n + -etje: man → mannetje.', explanation_es: 'Vocal corta + n → se dobla la n + -etje: man → mannetje.', level: 'A2' },
  { id: 'dim-ster', dutch: 'ster → ___', english: 'star', translation_es: 'estrella', answer: 'sterretje', options: ['sterretje', 'stertje', 'sterje', 'steretje'], category: 'etje', explanation: 'Short vowel + r → double the r + -etje: ster → sterretje.', explanation_es: 'Vocal corta + r → se dobla la r + -etje: ster → sterretje.', level: 'B1' },
  { id: 'dim-kam', dutch: 'kam → ___', english: 'comb', translation_es: 'peine', answer: 'kammetje', options: ['kammetje', 'kampje', 'kamtje', 'kamje'], category: 'etje', explanation: 'Short vowel + m → double the m + -etje (not -pje): kam → kammetje.', explanation_es: 'Vocal corta + m → se dobla la m + -etje (no -pje): kam → kammetje.', level: 'B1' },
  { id: 'dim-ding', dutch: 'ding → ___', english: 'thing', translation_es: 'cosa', answer: 'dingetje', options: ['dingetje', 'dingje', 'dingtje', 'dinkje'], category: 'etje', explanation: 'After stressed -ng → -etje: ding → dingetje.', explanation_es: 'Tras -ng tónica → -etje: ding → dingetje.', level: 'A2' },
  { id: 'dim-brug', dutch: 'brug → ___', english: 'bridge', translation_es: 'puente', answer: 'bruggetje', options: ['bruggetje', 'brugje', 'brugetje', 'brugtje'], category: 'etje', explanation: 'Short vowel + g → double the g + -etje: brug → bruggetje.', explanation_es: 'Vocal corta + g → se dobla la g + -etje: brug → bruggetje.', level: 'B1' },

  // ── -pje: after -m preceded by a long vowel, diphthong or consonant ────────
  { id: 'dim-boom', dutch: 'boom → ___', english: 'tree', translation_es: 'árbol', answer: 'boompje', options: ['boompje', 'boomtje', 'boometje', 'boomje'], category: 'pje', explanation: '-m after a long vowel → -pje: boom → boompje.', explanation_es: '-m tras vocal larga → -pje: boom → boompje.', level: 'A2' },
  { id: 'dim-raam', dutch: 'raam → ___', english: 'window', translation_es: 'ventana', answer: 'raampje', options: ['raampje', 'raamtje', 'raametje', 'raamje'], category: 'pje', explanation: '-m after a long vowel → -pje: raam → raampje.', explanation_es: '-m tras vocal larga → -pje: raam → raampje.', level: 'A2' },
  { id: 'dim-duim', dutch: 'duim → ___', english: 'thumb', translation_es: 'pulgar', answer: 'duimpje', options: ['duimpje', 'duimtje', 'duimetje', 'duimje'], category: 'pje', explanation: '-m after a diphthong → -pje: duim → duimpje.', explanation_es: '-m tras diptongo → -pje: duim → duimpje.', level: 'B1' },
  { id: 'dim-film', dutch: 'film → ___', english: 'film / clip', translation_es: 'película / vídeo', answer: 'filmpje', options: ['filmpje', 'filmtje', 'filmetje', 'filmje'], category: 'pje', explanation: '-m after a consonant → -pje: film → filmpje.', explanation_es: '-m tras consonante → -pje: film → filmpje.', level: 'A2' },
  { id: 'dim-arm', dutch: 'arm → ___', english: 'arm', translation_es: 'brazo', answer: 'armpje', options: ['armpje', 'armetje', 'armtje', 'armje'], category: 'pje', explanation: '-m after a consonant (r) → -pje: arm → armpje.', explanation_es: '-m tras consonante (r) → -pje: arm → armpje.', level: 'B1' },
  { id: 'dim-bloem', dutch: 'bloem → ___', english: 'flower', translation_es: 'flor', answer: 'bloempje', options: ['bloempje', 'bloemetje', 'bloemtje', 'bloemkje'], category: 'pje', explanation: '-m after a long vowel/diphthong → -pje: bloem → bloempje.', explanation_es: '-m tras vocal larga/diptongo → -pje: bloem → bloempje.', level: 'B1' },

  // ── -kje: unstressed -ing loses the g → -inkje ─────────────────────────────
  { id: 'dim-koning', dutch: 'koning → ___', english: 'king', translation_es: 'rey', answer: 'koninkje', options: ['koninkje', 'koningje', 'koningetje', 'koningtje'], category: 'kje', explanation: 'Unstressed -ing → drop the g, add -kje: koning → koninkje.', explanation_es: '-ing átona → se quita la g y se añade -kje: koning → koninkje.', level: 'B1' },
  { id: 'dim-woning', dutch: 'woning → ___', english: 'dwelling / home', translation_es: 'vivienda', answer: 'woninkje', options: ['woninkje', 'woningje', 'woningetje', 'woningpje'], category: 'kje', explanation: 'Unstressed -ing → -kje: woning → woninkje.', explanation_es: '-ing átona → -kje: woning → woninkje.', level: 'B1' },
  { id: 'dim-ketting', dutch: 'ketting → ___', english: 'chain / necklace', translation_es: 'cadena', answer: 'kettinkje', options: ['kettinkje', 'kettingje', 'kettingetje', 'kettingtje'], category: 'kje', explanation: 'Unstressed -ing → -kje: ketting → kettinkje.', explanation_es: '-ing átona → -kje: ketting → kettinkje.', level: 'B1' },

  // ── irregular: the stem vowel lengthens/changes ───────────────────────────
  { id: 'dim-blad', dutch: 'blad → ___', english: 'leaf / sheet', translation_es: 'hoja', answer: 'blaadje', options: ['blaadje', 'bladje', 'bladetje', 'bladtje'], category: 'irregular', explanation: 'Irregular: the vowel lengthens: blad → blaadje.', explanation_es: 'Irregular: la vocal se alarga: blad → blaadje.', level: 'B1' },
  { id: 'dim-gat', dutch: 'gat → ___', english: 'hole', translation_es: 'agujero', answer: 'gaatje', options: ['gaatje', 'gatje', 'gatetje', 'gatpje'], category: 'irregular', explanation: 'Irregular: the vowel lengthens: gat → gaatje.', explanation_es: 'Irregular: la vocal se alarga: gat → gaatje.', level: 'B1' },
  { id: 'dim-glas', dutch: 'glas → ___', english: 'glass', translation_es: 'vaso', answer: 'glaasje', options: ['glaasje', 'glasje', 'glasetje', 'glastje'], category: 'irregular', explanation: 'Irregular: the vowel lengthens: glas → glaasje.', explanation_es: 'Irregular: la vocal se alarga: glas → glaasje.', level: 'B1' },
  { id: 'dim-schip', dutch: 'schip → ___', english: 'ship', translation_es: 'barco', answer: 'scheepje', options: ['scheepje', 'schipje', 'schippje', 'schipetje'], category: 'irregular', explanation: 'Irregular: the vowel changes i → ee: schip → scheepje.', explanation_es: 'Irregular: la vocal cambia i → ee: schip → scheepje.', level: 'B1' },
  { id: 'dim-pad', dutch: 'pad → ___', english: 'path', translation_es: 'sendero', answer: 'paadje', options: ['paadje', 'padje', 'padetje', 'padtje'], category: 'irregular', explanation: 'Irregular: the vowel lengthens: pad → paadje.', explanation_es: 'Irregular: la vocal se alarga: pad → paadje.', level: 'B1' },
];

async function main() {
  console.log(`Inserting ${rows.length} diminutive exercises…`);
  const { error } = await supabase.from('diminutive_exercises').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Done.');
}

main();
