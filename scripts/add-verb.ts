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

// ── Claude call with rate-limit handling ─────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * One Claude request that automatically retries on 429 (rate limit) and 5xx,
 * honoring the Retry-After header. The free/low tiers allow only a few requests
 * per minute, so a batch of verbs will hit this — we wait it out instead of
 * failing. Returns the model's text response.
 */
async function callClaude(prompt: string, maxTokens: number, retries = 6): Promise<string> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY as string,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }),
    });

    if (res.ok) {
      const data = await res.json();
      return (data.content[0].text as string).trim();
    }

    const body = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < retries) {
      const retryAfter = Number(res.headers.get('retry-after'));
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000 + 500
        : Math.min(60000, 1000 * 2 ** attempt); // exponential backoff, capped at 60s
      console.warn(`  rate limited (${res.status}); waiting ${Math.round(waitMs / 1000)}s…`);
      await sleep(waitMs);
      continue;
    }
    throw new Error(`API error ${res.status}: ${body}`);
  }
}

// ── Verify the input is a real Dutch verb ─────────────────────────────────────

interface VerbCheck {
  isVerb: boolean;
  correctedSpelling: string | null;
  note: string;
}

/**
 * Ask the model whether the input is a genuine, correctly-spelled Dutch
 * infinitive before we generate/insert anything. Guards against typos and
 * non-verbs (nouns, adjectives, conjugated forms, non-Dutch words).
 */
async function verifyVerb(infinitive: string): Promise<VerbCheck> {
  const prompt = `Is "${infinitive}" a valid, correctly-spelled Dutch infinitive verb?

Return ONLY a JSON object (no markdown, no explanation) with this exact shape:
{"isVerb": <true|false>, "correctedSpelling": <string or null>, "note": "<max 12 words>"}

Rules:
- "isVerb" is true ONLY if "${infinitive}" itself is a real, correctly-spelled Dutch verb in its infinitive form.
- Do NOT count nouns, adjectives, conjugated forms, or non-Dutch words as verbs.
- "correctedSpelling": if it is not valid but is clearly a misspelling of a real Dutch infinitive verb, give the correct infinitive; otherwise null.`;

  const text = await callClaude(prompt, 256);
  return JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)) as VerbCheck;
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
      const text = await callClaude(prompt, 2048);
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

type AddResult = 'added' | 'exists' | 'not-verb' | 'error';

// Add a single verb. Never calls process.exit — returns a status so a batch can
// keep going, and logs one concise line per verb.
async function addOne(infinitive: string): Promise<AddResult> {
  const id = infinitive; // verb ids are the lowercase infinitive (see schema convention)

  // 1. Already in the DB?
  const { data: existing, error: lookupErr } = await supabase
    .from('verbs').select('id, english').eq('id', id).maybeSingle();
  if (lookupErr) {
    console.error(`  ✗ ${infinitive}: lookup error: ${lookupErr.message}`);
    return 'error';
  }
  if (existing) {
    console.log(`  • ${infinitive}: already exists (${existing.english}) — skipped.`);
    return 'exists';
  }

  if (!ANTHROPIC_KEY) {
    console.error(`  ✗ ${infinitive}: not in the DB and ANTHROPIC_API_KEY is not set — cannot generate.`);
    return 'error';
  }

  // 2. Verify it's a real Dutch verb before generating anything.
  try {
    const check = await verifyVerb(infinitive);
    if (!check.isVerb) {
      const suggestion = check.correctedSpelling?.trim().toLowerCase();
      if (suggestion && suggestion !== infinitive) {
        console.error(`  ✗ ${infinitive}: not a Dutch verb — did you mean "${suggestion}"?`);
      } else {
        console.error(`  ✗ ${infinitive}: not a Dutch verb${check.note ? ` (${check.note})` : ''}.`);
      }
      return 'not-verb';
    }
  } catch (e) {
    // Don't block on a transient verification failure — warn and continue.
    console.warn(`  ${infinitive}: could not verify (${e instanceof Error ? e.message : String(e)}); proceeding.`);
  }

  // 3. Generate the data.
  let gen: GeneratedVerb;
  try {
    gen = await generateVerb(infinitive);
  } catch (e) {
    console.error(`  ✗ ${infinitive}: generation failed: ${e instanceof Error ? e.message : String(e)}`);
    return 'error';
  }

  // 4. Insert the verb (parent row first — exercises reference it via FK).
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
    console.error(`  ✗ ${infinitive}: insert failed: ${verbErr.message}`);
    return 'error';
  }

  // 5. Insert the exercises.
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
    console.error(`  ✗ ${infinitive}: verb added but exercises failed: ${exErr.message}`);
    return 'error';
  }

  console.log(`  ✓ ${infinitive} → ${gen.english} (${gen.translation_es}) · ${gen.level} · aux ${gen.auxiliary} · ${exerciseRows.length} exercises`);
  return 'added';
}

async function main() {
  // Accept one or many verbs, separated by commas and/or spaces.
  const raw = process.argv.slice(2).join(' ').trim();
  const verbs = [...new Set(raw.split(/[\s,]+/).map(v => v.trim().toLowerCase()).filter(Boolean))];
  if (verbs.length === 0) {
    console.error('Usage: npx tsx --env-file=.env scripts/add-verb.ts <verb>[, <verb> …]');
    console.error('Example: npm run add-verb -- werken, lopen, fietsen');
    process.exit(1);
  }

  if (!ANTHROPIC_KEY) {
    console.warn('Note: ANTHROPIC_API_KEY is not set — verbs not already in the DB cannot be generated.\n');
  }

  console.log(`Processing ${verbs.length} verb(s) with ${MODEL}: ${verbs.join(', ')}\n`);

  const counts: Record<AddResult, number> = { added: 0, exists: 0, 'not-verb': 0, error: 0 };
  for (const v of verbs) {
    counts[await addOne(v)] += 1;
  }

  console.log(`\nDone. added ${counts.added}, existing ${counts.exists}, not-a-verb ${counts['not-verb']}, errors ${counts.error}.`);
  process.exit(counts.error > 0 ? 1 : 0);
}

main();
