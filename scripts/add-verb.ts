/**
 * Add a single Dutch verb to the database.
 *
 * Checks whether the verb already exists in the `verbs` table. If it does,
 * the script reports it and exits. If it does not, it asks Claude to generate
 * the verb's metadata (English meaning, CEFR level, auxiliary, full
 * conjugation, Spanish translation) plus a set of fill-in-the-blank exercises
 * — each with a Spanish translation — and inserts the verb and its exercises.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... npm run add-verb -- werken
 *   ANTHROPIC_API_KEY=sk-ant-... npx tsx --env-file=.env scripts/add-verb.ts werken
 */

import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

// ── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL  = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL         = 'claude-sonnet-4-6';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  console.error('Run with: npx tsx --env-file=.env scripts/add-verb.ts <verb>');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  global: { fetch: fetch as typeof fetch },
  realtime: { transport: ws },
});

// ── Types mirroring the DB schema ─────────────────────────────────────────────

interface GeneratedExercise {
  dutch: string;          // sentence with a ___ blank
  english: string;
  answer: string;         // the conjugated form that fills the blank
  tense: 'present' | 'past' | 'perfect';
  translation_es: string;
}

interface GeneratedVerb {
  infinitive: string;
  english: string;        // e.g. "to work"
  translation_es: string; // e.g. "trabajar"
  level: 'A1' | 'A2' | 'B1';
  auxiliary: 'hebben' | 'zijn';
  conjugation: {
    present: { ik: string; jij: string; hij: string; wij: string; jullie: string; zij: string };
    pastSingular: string;
    pastPlural: string;
    pastParticiple: string;
  };
  exercises: GeneratedExercise[];
}

// ── Generate the verb data via Claude ─────────────────────────────────────────

async function generateVerb(infinitive: string, retries = 2): Promise<GeneratedVerb> {
  const prompt = `You are a Dutch language expert. Generate complete data for the Dutch verb "${infinitive}".

Return ONLY a JSON object (no markdown, no explanation) with exactly this shape:

{
  "infinitive": "<the Dutch infinitive, lowercase>",
  "english": "to <english meaning>",
  "translation_es": "<spanish infinitive translation, e.g. trabajar>",
  "level": "<A1 | A2 | B1>",
  "auxiliary": "<hebben | zijn>",
  "conjugation": {
    "present": {
      "ik": "<1st person singular>",
      "jij": "<2nd person singular>",
      "hij": "<3rd person singular>",
      "wij": "<1st person plural>",
      "jullie": "<2nd person plural>",
      "zij": "<3rd person plural>"
    },
    "pastSingular": "<simple past singular>",
    "pastPlural": "<simple past plural>",
    "pastParticiple": "<past participle, e.g. gewerkt>"
  },
  "exercises": [
    {
      "dutch": "<a natural Dutch sentence with exactly one blank written as ___>",
      "english": "<english translation of the full sentence with the verb in place>",
      "answer": "<the exact conjugated form that fills the ___ blank>",
      "tense": "<present | past | perfect>",
      "translation_es": "<spanish translation of the full sentence with the verb in place>"
    }
  ]
}

Rules:
- Conjugations must be grammatically correct standard Dutch.
- "auxiliary" is the perfect-tense auxiliary (hebben or zijn).
- Provide 6 exercises: at least 2 "present", 2 "past", and 2 "perfect".
- In each exercise the "answer" must be exactly the word(s) that replace ___ in "dutch".
- For "perfect" exercises the blank is usually the past participle (and the auxiliary appears in the sentence).
- Keep sentences short, natural, and beginner-appropriate for the chosen level.`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY as string,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 2048,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) {
        throw new Error(`API error ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      const text = (data.content[0].text as string).trim();
      const start = text.indexOf('{');
      const end   = text.lastIndexOf('}') + 1;
      const parsed = JSON.parse(text.slice(start, end)) as GeneratedVerb;

      validate(parsed, infinitive);
      return parsed;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (attempt < retries) {
        console.error(`  Attempt ${attempt + 1} failed: ${msg}. Retrying…`);
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      } else {
        throw e;
      }
    }
  }
  throw new Error('unreachable');
}

function validate(v: GeneratedVerb, infinitive: string): void {
  if (!v.infinitive || !v.english || !v.conjugation || !Array.isArray(v.exercises)) {
    throw new Error('Generated data is missing required fields.');
  }
  if (!['A1', 'A2', 'B1'].includes(v.level)) throw new Error(`Bad level: ${v.level}`);
  if (!['hebben', 'zijn'].includes(v.auxiliary)) throw new Error(`Bad auxiliary: ${v.auxiliary}`);
  if (v.exercises.length === 0) throw new Error('No exercises generated.');
  for (const ex of v.exercises) {
    if (!ex.dutch.includes('___')) throw new Error(`Exercise missing ___ blank: "${ex.dutch}"`);
    if (!['present', 'past', 'perfect'].includes(ex.tense)) throw new Error(`Bad tense: ${ex.tense}`);
  }
  // Soft sanity check that the model stayed on topic.
  if (v.infinitive.toLowerCase() !== infinitive.toLowerCase()) {
    console.warn(`  Note: requested "${infinitive}" but model returned "${v.infinitive}".`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const raw = process.argv[2];
  if (!raw) {
    console.error('Usage: npx tsx --env-file=.env scripts/add-verb.ts <dutch-verb>');
    process.exit(1);
  }

  const infinitive = raw.trim().toLowerCase();
  const id = infinitive; // verb ids are the lowercase infinitive (see schema convention)

  // 1. Does it already exist?
  const { data: existing, error: lookupErr } = await supabase
    .from('verbs')
    .select('id, infinitive, english')
    .eq('id', id)
    .maybeSingle();

  if (lookupErr) {
    console.error('Lookup error:', lookupErr.message);
    process.exit(1);
  }
  if (existing) {
    console.log(`✓ "${infinitive}" already exists in the verbs table (${existing.english}). Nothing to do.`);
    process.exit(0);
  }

  // 2. Generate the data (this is the only step that needs the API key).
  if (!ANTHROPIC_KEY) {
    console.error(`"${infinitive}" not found, so it needs to be generated — but ANTHROPIC_API_KEY is not set.`);
    console.error('Get a key at https://console.anthropic.com and re-run:');
    console.error(`  ANTHROPIC_API_KEY=sk-ant-... npx tsx --env-file=.env scripts/add-verb.ts ${infinitive}`);
    process.exit(1);
  }
  console.log(`"${infinitive}" not found. Generating verb data with ${MODEL}…`);
  const gen = await generateVerb(infinitive);
  console.log(`  → ${gen.english} (${gen.translation_es}) · ${gen.level} · aux ${gen.auxiliary} · ${gen.exercises.length} exercises`);

  // 3. Insert the verb (parent row first — exercises reference it via FK).
  const { error: verbErr } = await supabase.from('verbs').insert({
    id,
    infinitive: gen.infinitive.toLowerCase(),
    english: gen.english,
    translation_es: gen.translation_es,
    level: gen.level,
    auxiliary: gen.auxiliary,
    conjugation: gen.conjugation,
  });
  if (verbErr) {
    console.error('Failed to insert verb:', verbErr.message);
    process.exit(1);
  }

  // 4. Insert the exercises.
  const exerciseRows = gen.exercises.map(ex => ({
    verb_id: id,
    dutch: ex.dutch,
    english: ex.english,
    answer: ex.answer,
    tense: ex.tense,
    translation_es: ex.translation_es,
  }));

  const { error: exErr } = await supabase
    .from('exercises')
    .upsert(exerciseRows, { onConflict: 'verb_id,dutch' });
  if (exErr) {
    console.error('Verb was added, but inserting exercises failed:', exErr.message);
    process.exit(1);
  }

  console.log(`Done. Added "${infinitive}" with ${exerciseRows.length} exercises.`);
}

main();
