export interface GuideSection {
  heading: string;
  paragraphs: string[];
  examples?: string[];
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  /** Used as the <h1> and the SEO <title>. */
  title: string;
  /** Meta description + index-card subtitle. */
  description: string;
  intro: string;
  sections: GuideSection[];
  faq: GuideFaq[];
  /** Call to action into the matching exercise. */
  cta: { label: string; to: string };
}

// SEO landing pages targeting high-intent "how does X work in Dutch" queries.
// English content (the largest search market for learning Dutch); each funnels
// into its interactive exercise.
export const GUIDES: Guide[] = [
  {
    slug: 'de-or-het',
    title: 'De or Het? How to Choose the Right Dutch Article',
    description:
      'A practical guide to Dutch de and het: the categories and word endings that reliably tell you which definite article a noun takes — with examples and free practice.',
    intro:
      "Dutch has two definite articles: de and het. About 75% of nouns are de-words and 25% are het-words. You can't always tell from the word alone — you learn the article with the noun — but several endings and categories are completely reliable.",
    sections: [
      {
        heading: 'The basics',
        paragraphs: [
          'de is the common-gender article and het is the neuter one. Two shortcuts are always true: every plural uses de, and every diminutive (a word ending in -je) uses het.',
        ],
        examples: ['de man', 'de vrouw', 'het huis', 'het meisje', 'de huizen (plural → de)'],
      },
      {
        heading: 'Endings that are always “de”',
        paragraphs: [
          'These suffixes reliably signal a de-word, as do most nouns for people with a natural gender.',
        ],
        examples: ['-ing: de mening', '-heid: de vrijheid', '-teit: de kwaliteit', '-ie / -atie: de politie, de situatie', '-schap: de vriendschap', '-aar / -er: de leraar, de bakker'],
      },
      {
        heading: 'Endings that are always “het”',
        paragraphs: [
          'These reliably signal a het-word, including any infinitive used as a noun.',
        ],
        examples: ['diminutives -je: het meisje', 'ge- prefix: het gebouw', '-um: het museum', '-ment: het document', 'infinitive as noun: het zwemmen'],
      },
      {
        heading: 'When in doubt',
        paragraphs: [
          'For everything else, learn the article together with the noun (store “het huis”, not just “huis”). If you truly have to guess, de is the statistical safe bet — but drilling real nouns is what makes it automatic.',
        ],
      },
    ],
    faq: [
      { q: 'Is it de or het huis?', a: 'It is het huis — huis is a neuter (het) word.' },
      { q: 'Are Dutch plurals de or het?', a: 'Always de. For example, het huis becomes de huizen in the plural.' },
      { q: 'Which article do diminutives take?', a: 'Always het: het huisje, het meisje, het boekje.' },
    ],
    cta: { label: 'Practice de / het →', to: '/articles' },
  },
  {
    slug: 'niet-vs-geen',
    title: 'Niet vs Geen: Dutch Negation Explained',
    description:
      'When to use niet and when to use geen in Dutch — one simple rule for choosing, plus where niet goes in the sentence, with clear examples and free practice.',
    intro:
      'Dutch has two negation words: niet and geen. Choosing between them follows one clear rule. Placing niet correctly in the sentence is the trickier part.',
    sections: [
      {
        heading: 'Use geen for indefinite nouns',
        paragraphs: [
          'Use geen to negate a noun that has no article, has “een”, or is plural/uncountable. It replaces “een” or sits directly before the noun.',
        ],
        examples: ['Ik heb een auto → Ik heb geen auto.', 'Ik drink geen koffie.', 'Zij heeft geen kinderen.'],
      },
      {
        heading: 'Use niet for everything else',
        paragraphs: [
          'Use niet to negate verbs, adjectives, adverbs, and definite nouns (with de/het, dit/dat, a possessive, or a proper name).',
        ],
        examples: ['Ik ken de man niet.', 'Dat is niet mijn boek.', 'Het is niet mooi.'],
      },
      {
        heading: 'Where does niet go?',
        paragraphs: [
          'niet goes at the end of the clause, except that it comes before a predicate adjective, a prepositional/place phrase, a separable prefix, an infinitive, and a past participle.',
        ],
        examples: ['Het huis is niet groot.', 'Ik woon niet in Amsterdam.', 'Ik bel je niet op.', 'Ik heb niet gewerkt.'],
      },
    ],
    faq: [
      { q: 'Is it niet or geen for “I have no time”?', a: 'geen: “Ik heb geen tijd” — tijd is an indefinite noun.' },
      { q: 'Why is it “Ik ken hem niet” and not geen?', a: 'Because “hem” is a definite pronoun; only indefinite nouns take geen.' },
      { q: 'Does geen replace “een”?', a: 'Yes — “een auto” becomes “geen auto”. geen takes the article’s place.' },
    ],
    cta: { label: 'Practice niet vs geen →', to: '/negation' },
  },
  {
    slug: 'dutch-diminutives',
    title: 'Dutch Diminutives: -je, -tje, -etje, -pje, -kje',
    description:
      'How Dutch diminutives (verkleinwoorden) work: which suffix to add — -je, -tje, -etje, -pje or -kje — based on how the word ends, plus irregulars and free practice.',
    intro:
      'A diminutive (verkleinwoord) makes something small, cute, or informal, and Dutch uses them constantly. Every diminutive is a het-word. The suffix you add depends on how the base word ends.',
    sections: [
      { heading: '-je (the default)', paragraphs: ['After most consonants (b, d, t, k, p, f, s, ch, g).'], examples: ['boek → boekje', 'huis → huisje', 'kat → katje'] },
      { heading: '-tje', paragraphs: ['After a vowel or diphthong, or after l/n/r/w following a long vowel. A word ending in a single stressed vowel doubles it.'], examples: ['stoel → stoeltje', 'ei → eitje', 'auto → autootje'] },
      { heading: '-etje', paragraphs: ['After l, m, n, ng or r preceded by a short stressed vowel — double the consonant.'], examples: ['bal → balletje', 'man → mannetje', 'ding → dingetje'] },
      { heading: '-pje', paragraphs: ['After -m preceded by a long vowel, a diphthong, or a consonant.'], examples: ['boom → boompje', 'film → filmpje', 'arm → armpje'] },
      { heading: '-kje', paragraphs: ['After unstressed -ing, where the g drops.'], examples: ['koning → koninkje', 'woning → woninkje'] },
      { heading: 'Irregulars', paragraphs: ['A few words lengthen or change the stem vowel.'], examples: ['glas → glaasje', 'gat → gaatje', 'schip → scheepje'] },
    ],
    faq: [
      { q: 'What gender are Dutch diminutives?', a: 'Always het, regardless of the base noun’s gender.' },
      { q: 'Why is it boompje and not boomje?', a: 'A word ending in -m after a long vowel takes -pje.' },
      { q: 'Why does koning become koninkje?', a: 'Words ending in unstressed -ing drop the g and add -kje.' },
    ],
    cta: { label: 'Practice diminutives →', to: '/diminutives' },
  },
  {
    slug: 'dutch-word-order',
    title: 'Dutch Word Order: The V2 Rule and Beyond',
    description:
      'Understand Dutch word order: the verb-second (V2) rule, inversion after fronting, verb-final subordinate clauses, and modal/perfect patterns — with free practice.',
    intro:
      'Dutch word order is strict but very learnable. The anchor is the V2 rule: in a main clause, the finite verb is always in second position.',
    sections: [
      { heading: 'The V2 rule', paragraphs: ['The finite (conjugated) verb is the second element of a main clause — no matter what comes first.'], examples: ['Ik eet brood.', 'Elke dag eet ik brood.'] },
      { heading: 'Fronting and inversion', paragraphs: ['You can move any element to the front for emphasis. The verb stays in second position, so the subject shifts to third (inversion).'], examples: ['Morgen ga ik naar school.', 'In de zomer gaan wij naar Spanje.'] },
      { heading: 'Subordinate clauses send the verb to the end', paragraphs: ['After a subordinating conjunction (dat, omdat, als, of, wanneer, toen…), the finite verb moves to the end of the clause.'], examples: ['Ik weet dat hij ziek is.', 'Ze blijft thuis omdat het regent.'] },
      { heading: 'Modals and the perfect', paragraphs: ['The finite verb takes position 2 (main) or the end (subordinate); the infinitive or past participle goes to the very end.'], examples: ['Ik kan zwemmen.', 'Ik heb gegeten.'] },
    ],
    faq: [
      { q: 'What is the V2 rule in Dutch?', a: 'In a main clause the finite verb is always the second element of the sentence.' },
      { q: 'Where does the verb go in a subordinate clause?', a: 'To the end of the clause, after conjunctions like dat, omdat, or als.' },
      { q: 'Where does the past participle go?', a: 'At the end: “Ik heb gisteren hard gewerkt.”' },
    ],
    cta: { label: 'Practice word order →', to: '/word-order' },
  },
  {
    slug: 'dutch-plurals',
    title: 'Dutch Plurals: -en, -s, -eren and Irregulars',
    description:
      'How to form Dutch plurals: when to add -en vs -s, the spelling changes, the small -eren group and irregulars — with examples and free practice.',
    intro:
      'Most Dutch nouns form their plural with -en; a smaller group takes -s; a handful use -eren or change the stem. Whatever the singular article was, every plural takes de.',
    sections: [
      {
        heading: '-en (the most common)',
        paragraphs: [
          'Add -en, applying the usual spelling rules: a short vowel + consonant doubles the consonant; a long vowel in an open syllable drops a letter; -s often becomes -z and -f becomes -v.',
        ],
        examples: ['bed → bedden', 'jaar → jaren', 'boom → bomen', 'huis → huizen', 'brief → brieven'],
      },
      {
        heading: '-s',
        paragraphs: [
          'Nouns ending in the unstressed endings -el, -er, -em, -en take -s, as do all diminutives. Words ending in a vowel add -’s.',
        ],
        examples: ['tafel → tafels', 'kamer → kamers', 'meisje → meisjes', "auto → auto's"],
      },
      {
        heading: '-eren (a small fixed group)',
        paragraphs: ['A short, closed set of nouns — worth memorising as a list.'],
        examples: ['kind → kinderen', 'ei → eieren', 'blad → bladeren'],
      },
      {
        heading: 'Irregular',
        paragraphs: ['A few nouns change the stem vowel.'],
        examples: ['stad → steden', 'schip → schepen', 'lid → leden'],
      },
    ],
    faq: [
      { q: 'Is it -en or -s for tafel?', a: 'tafels — nouns ending in unstressed -el take -s.' },
      { q: 'Why does huis become huizen?', a: 'Between vowels the -s becomes -z, then you add -en: huis → huizen.' },
      { q: 'What article do plurals take?', a: 'Always de, even for former het-words: het huis → de huizen.' },
    ],
    cta: { label: 'Practice plurals →', to: '/plurals' },
  },
  {
    slug: 'dutch-separable-verbs',
    title: 'Dutch Separable Verbs: When to Split the Prefix',
    description:
      'Dutch separable verbs like opbellen and meenemen split in some sentences and stay together in others — main clause, perfect, subordinate and modal — with examples.',
    intro:
      'Separable verbs (opbellen, meenemen, aankomen…) have a stressed prefix that detaches in some sentence types and stays attached in others. Which one it is depends on the clause.',
    sections: [
      { heading: 'Main clause: prefix to the end', paragraphs: ['The conjugated verb sits in position 2 and the prefix goes to the end of the clause.'], examples: ['Hij belt zijn moeder op.'] },
      { heading: 'Perfect: ge- between prefix and stem', paragraphs: ['The past participle is prefix + ge + stem.'], examples: ['Hij heeft zijn moeder opgebeld.', 'Ik heb mijn tas meegenomen.'] },
      { heading: 'Subordinate clause: kept together at the end', paragraphs: ['After dat/omdat/als… the prefix and verb stay joined at the end.'], examples: ['Ze weet dat hij zijn moeder opbelt.'] },
      { heading: 'Modal verb: full infinitive', paragraphs: ['After a modal, the whole infinitive (prefix + verb) goes to the end.'], examples: ['Hij moet zijn moeder opbellen.'] },
    ],
    faq: [
      { q: 'How do I know a verb is separable?', a: 'The stress falls on the prefix, which is usually a preposition/adverb: op-, mee-, aan-, uit-, af-.' },
      { q: 'Where does the prefix go in a main clause?', a: 'To the end: “Hij belt zijn moeder op.”' },
      { q: 'How is the perfect formed?', a: 'ge- is inserted between the prefix and stem: opbellen → opgebeld.' },
    ],
    cta: { label: 'Practice separable verbs →', to: '/separable-verbs' },
  },
  {
    slug: 'dutch-position-verbs',
    title: 'staan, liggen, zitten, zijn: Dutch Position Verbs',
    description:
      'Dutch uses staan, liggen and zitten instead of a general “to be” to say where things are. Here is how to pick the right one, with examples and free practice.',
    intro:
      'Where English just says “is”, Dutch usually picks a specific position verb — staan, liggen or zitten — based on how the object is placed. zijn is kept for abstract states.',
    sections: [
      { heading: 'staan – upright things', paragraphs: ['People and animals standing, and objects that stand on a base: bottles, trees, buildings, vehicles; also text written on something.'], examples: ['De fles staat op tafel.', 'De leraar staat voor de klas.'] },
      { heading: 'liggen – flat / horizontal things', paragraphs: ['Objects lying on a surface, people lying down, and geographic locations.'], examples: ['Het boek ligt op tafel.', 'Amsterdam ligt in Nederland.'] },
      { heading: 'zitten – enclosed / contained', paragraphs: ['People or animals seated, things inside something, and hidden contents or mistakes.'], examples: ['De sleutels zitten in mijn zak.', 'Er zit een fout in de tekst.'] },
      { heading: 'zijn – abstract states', paragraphs: ['Properties, feelings, events and time use the plain verb zijn.'], examples: ['Hij is ziek.', 'De les is om drie uur.'] },
    ],
    faq: [
      { q: 'A book on a table: ligt or staat?', a: 'ligt — a book lies flat, so it uses liggen.' },
      { q: 'A bottle on a table?', a: 'staat — a bottle stands upright, so it uses staan.' },
      { q: 'When do I just use zijn?', a: 'For abstract states: feelings, properties, events and clock times.' },
    ],
    cta: { label: 'Practice position verbs →', to: '/positional-verbs' },
  },
  {
    slug: 'dutch-adjective-endings',
    title: 'Dutch Adjective Endings: When to Add -e',
    description:
      'The Dutch adjective -e rule made simple: when an attributive adjective takes -e (de grote man) and when it stays bare (een groot huis), plus predicative adjectives.',
    intro:
      'Before a noun, a Dutch adjective usually takes an -e ending — with one key exception. After a verb like zijn, it never changes.',
    sections: [
      { heading: 'Add -e in most cases', paragraphs: ['After de, after any definite word (het/dit/mijn…), in the plural, and after een with a de-word.'], examples: ['de grote man', 'een grote man', 'het grote huis', 'grote huizen'] },
      { heading: 'No -e: a singular, indefinite het-word', paragraphs: ['When a het-word is singular AND indefinite (een, geen, or no article), the adjective stays bare.'], examples: ['een groot huis', 'geen groot probleem', 'groot huis'] },
      { heading: 'Predicative adjectives never inflect', paragraphs: ['After zijn or worden, the adjective keeps its base form.'], examples: ['Het huis is groot.', 'De soep wordt koud.'] },
    ],
    faq: [
      { q: 'Is it “een groot huis” or “een grote huis”?', a: 'een groot huis — huis is a singular, indefinite het-word, so no -e.' },
      { q: 'Do adjectives change after “is”?', a: 'No. Predicative adjectives (after zijn/worden) never take -e.' },
      { q: 'Do de-words always take -e?', a: 'Yes, attributively — even with een: “een grote man”.' },
    ],
    cta: { label: 'Practice adjectives →', to: '/adjectives' },
  },
  {
    slug: 'dutch-time-prepositions',
    title: 'om, op, in: Dutch Prepositions of Time',
    description:
      'Which Dutch preposition to use for time: om for clock times, op for days and dates, in for months, seasons and years — plus na, voor, tijdens, sinds, tot and over.',
    intro:
      'The tricky part of Dutch time expressions is choosing between om, op and in. Here is the quick rule, plus the other common time prepositions.',
    sections: [
      { heading: 'om – clock times', paragraphs: ['Use om for an exact time on the clock.'], examples: ['om acht uur', 'om half drie', 'om middernacht'] },
      { heading: 'op – days and dates', paragraphs: ['Use op for days of the week and full dates.'], examples: ['op maandag', 'op 5 mei', 'op mijn verjaardag'] },
      { heading: 'in – months, seasons, years, parts of the day', paragraphs: ['Use in for longer periods.'], examples: ['in juni', 'in de zomer', 'in 1998', 'in de ochtend'] },
      { heading: 'Other useful time prepositions', paragraphs: ['na (after), voor (before), tijdens (during), sinds (since — a past start), vanaf (from — often future), tot (until), over (in… — future), binnen (within a deadline).'], examples: ['na het eten', 'tijdens de vakantie', 'sinds 2015', 'over tien minuten'] },
    ],
    faq: [
      { q: 'Is it in or op for a date?', a: 'op — for example “op 5 mei”. Months use in (“in mei”).' },
      { q: 'What’s the difference between sinds and vanaf?', a: 'sinds looks back to a start in the past; vanaf marks a starting point, often in the future.' },
      { q: 'Which preposition for a clock time?', a: 'om: “De film begint om acht uur.”' },
    ],
    cta: { label: 'Practice time prepositions →', to: '/time-prepositions' },
  },
  {
    slug: 'dutch-er-prepositions',
    title: 'Dutch Pronominal Adverbs: erin, eraan, erop (er + Preposition)',
    description:
      'How er + preposition works in Dutch: erin, eruit and erop for places, and eraan, erop, ervoor for verbs with a fixed preposition — why you say eraan and not aan het, with free practice.',
    intro:
      'When a pronoun like het, dat or dit follows a preposition and refers to a thing (not a person), Dutch does not say “aan het” or “op dat”. Instead it fuses er with the preposition into one word: a pronominal adverb (voornaamwoordelijk bijwoord) such as eraan, erop or erin. There are two everyday uses.',
    sections: [
      {
        heading: 'Use 1 — place and direction',
        paragraphs: [
          'The er-word replaces a known location, answering “into/out of/onto what?”. Here er points at a place already in the conversation.',
        ],
        examples: ['Ik draai de lamp erin. (into it)', 'Haal de sleutel eruit. (out of it)', 'Leg het boek erop. (on it)', 'Veeg het stof eraf. (off it)'],
      },
      {
        heading: 'Use 2 — object of a fixed preposition',
        paragraphs: [
          'Many Dutch verbs take a fixed preposition (denken aan, wachten op, kiezen voor). When the object is a thing, the preposition merges with er. So “I think about it” is Ik denk eraan, never Ik denk aan het.',
        ],
        examples: ['denken aan → eraan: Ik denk eraan.', 'wachten op → erop: We wachten erop.', 'praten over → erover: We praten erover.', 'kiezen voor → ervoor: Ik kies ervoor.'],
      },
      {
        heading: 'er can split from its preposition',
        paragraphs: [
          'When another word (an adverb, an object, niet) comes between them, er moves forward and the preposition stays behind. The two halves “hug” the middle of the sentence.',
        ],
        examples: ['Ik denk er niet aan.', 'Ik denk er vaak aan.', 'Hij rekent er helemaal op.'],
      },
      {
        heading: 'Things vs. people',
        paragraphs: [
          'er-words are only for things and ideas. For people, keep the preposition and use a normal pronoun: aan hem, op haar, met wie.',
        ],
        examples: ['Ik denk aan hem. (a person)', 'Ik denk eraan. (a thing)', 'Waar wacht je op? → Ik wacht erop.', 'Op wie wacht je? → Ik wacht op hem.'],
      },
    ],
    faq: [
      { q: 'Why eraan and not “aan het”?', a: 'A preposition + the pronoun het/dat/dit for a thing always fuses into er + preposition: eraan, erop, ervoor. “aan het” is not used to mean “about it”.' },
      { q: 'When does er separate from the preposition?', a: 'Whenever a word comes between them — an adverb, an object or niet: “Ik denk er niet aan.” With nothing in between, they join: “Ik denk eraan.”' },
      { q: 'Can I use er-words for people?', a: 'No. Use the preposition with a pronoun for people (aan hem, op haar). er-words are for things and ideas only.' },
    ],
    cta: { label: 'Practice er + preposition →', to: '/er-prepositions' },
  },
  {
    slug: 'dutch-modal-verbs',
    title: 'Dutch Modal Verbs: moeten, mogen, willen, zullen, kunnen, hoeven',
    description:
      'Master the six Dutch modal verbs: what moeten, mogen, willen, zullen, kunnen and hoeven mean, their irregular present forms, the simple past, and why the main verb goes to the end — with free practice.',
    intro:
      'Modal verbs colour another verb: they say whether an action is obligatory, allowed, wanted, possible, future or unnecessary. Dutch has six. The modal is conjugated in the normal verb slot, and the main verb stays as an infinitive at the end of the clause.',
    sections: [
      {
        heading: 'What each modal means',
        paragraphs: [
          'moeten = obligation (must/have to); mogen = permission (may/be allowed); willen = wish (want); kunnen = ability or possibility (can); zullen = future or a suggestion (shall/will); hoeven = lack of necessity.',
        ],
        examples: ['Ik moet werken.', 'Je mag naar huis.', 'Ik wil koffie.', 'Zij kan zwemmen.', 'Ik zal bellen.', 'Je hoeft niet te komen.'],
      },
      {
        heading: 'Word order: infinitive at the end',
        paragraphs: [
          'The modal takes second position in a main clause; the verb it governs becomes a bare infinitive at the very end.',
        ],
        examples: ['Ik moet vandaag hard werken.', 'Kun je mij morgen helpen?', 'We willen dit weekend naar Utrecht gaan.'],
      },
      {
        heading: 'Irregular present forms',
        paragraphs: [
          'The singular forms are irregular and worth memorising; jij can take a short form. Plural forms equal the infinitive.',
        ],
        examples: ['moeten: ik/jij/hij moet · wij moeten', 'mogen: ik/jij/hij mag · wij mogen', 'willen: ik wil, jij wil(t), hij wil · wij willen', 'kunnen: ik kan, jij kan/kunt, hij kan · wij kunnen', 'zullen: ik zal, jij zal/zult, hij zal · wij zullen'],
      },
      {
        heading: 'hoeven — the negative of moeten',
        paragraphs: [
          'hoeven means “not have to”. It almost always appears with niet, geen, pas, maar or nooit, and adds te before the infinitive — unlike the other modals.',
        ],
        examples: ['Je hoeft niet te betalen.', 'Ik hoef vandaag niet te werken.', 'Je hoeft maar één ticket te kopen.'],
      },
      {
        heading: 'The simple past',
        paragraphs: [
          'The past-tense forms are also irregular: moest, mocht, wilde (or wou), kon, zou, hoefde. Plurals add -en (moesten, konden, zouden…).',
        ],
        examples: ['Ik moest naar de dokter.', 'Als kind mocht ik niet laat opblijven.', 'Hij zei dat hij later zou komen.', 'Ze konden niet komen door de storm.'],
      },
    ],
    faq: [
      { q: 'What is the difference between kunnen and mogen?', a: 'kunnen is ability or possibility (“I can swim”); mogen is permission (“I’m allowed to”). English “can” covers both, so Dutch splits them.' },
      { q: 'When do I use hoeven instead of moeten?', a: 'Use hoeven for “don’t have to”. It comes with niet/geen and adds te: “Je hoeft niet te komen.” Its positive counterpart is moeten.' },
      { q: 'Does the second verb change after a modal?', a: 'No — it stays an infinitive and moves to the end of the clause: “Ik wil een boek lezen.” Only the modal is conjugated.' },
    ],
    cta: { label: 'Practice modal verbs →', to: '/modal-verbs' },
  },
];

export const guideBySlug = (slug: string | undefined): Guide | undefined =>
  GUIDES.find((g) => g.slug === slug);
