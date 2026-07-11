/**
 * Add a Dutch separable verb (scheidbaar werkwoord) to the database.
 *
 * Checks whether the verb already exists in `separable_verb_sets`. If it does,
 * the script reports it and skips. Otherwise it asks Claude to generate the
 * verb's English + Spanish meaning and a set of exactly FOUR fill-in-the-blank
 * exercises — one per grammatical context (main / perfect / subordinate / modal)
 * — then inserts the verb set and its exercises.
 *
 * Each exercise mirrors what the Separable Verbs page teaches (one ___ blank,
 * one single-token answer per context):
 *   • main        — main clause: the prefix splits off to the END. Blank = the
 *                   separated prefix.            e.g. "Ik sta om zes uur ___."  → op
 *   • perfect     — present perfect: past participle with ge- inside.
 *                   Blank = the participle.       e.g. "Ik ben vroeg ___."       → opgestaan
 *   • subordinate — subordinate clause (omdat/dat/als …): verb stays TOGETHER,
 *                   conjugated, at the end. Blank = joined verb. "…, omdat ik vroeg ___." → opsta
 *   • modal       — with a modal (wil/moet/kan …): FULL INFINITIVE at the end.
 *                   Blank = the infinitive.       e.g. "Ik moet morgen ___."     → opstaan
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... npm run add-separable-verb -- opstaan
 *   ANTHROPIC_API_KEY=sk-ant-... npx tsx --env-file=.env scripts/add-separable-verb.ts opstaan, aankomen, meenemen
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
  console.error('Run with: npx tsx --env-file=.env scripts/add-separable-verb.ts <verb>');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  global: { fetch: fetch as typeof fetch },
  realtime: { transport: ws },
});

// ── Types mirroring the DB schema ─────────────────────────────────────────────

type Context = 'main' | 'perfect' | 'subordinate' | 'modal';
const CONTEXTS: Context[] = ['main', 'perfect', 'subordinate', 'modal'];

interface GeneratedExercise {
  dutch: string;          // sentence with exactly one ___ blank
  english: string;        // full sentence translated, verb in place
  answer: string;         // the exact token(s) that fill the ___ blank
  context: Context;
  translation_es: string; // full sentence in Spanish, verb in place
}

interface GeneratedSet {
  infinitive: string;     // e.g. "opstaan"
  english: string;        // e.g. "to get up"
  translation_es: string; // e.g. "levantarse"
  exercises: GeneratedExercise[];
}

// ── Claude call with rate-limit handling ─────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * One Claude request that automatically retries on 429 (rate limit) and 5xx,
 * honoring the Retry-After header. Returns the model's text response.
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

// ── Verify the input is a real Dutch separable verb ──────────────────────────

interface VerbCheck {
  isSeparable: boolean;
  correctedSpelling: string | null;
  note: string;
}

/**
 * Ask the model whether the input is a genuine, correctly-spelled Dutch
 * SEPARABLE verb before we generate/insert anything. Rejects typos, non-verbs
 * and inseparable-prefix verbs (be-, ver-, ont-, ge-, her-, er-, …).
 */
async function verifySeparableVerb(infinitive: string): Promise<VerbCheck> {
  const prompt = `Is "${infinitive}" a valid, correctly-spelled Dutch SEPARABLE verb (scheidbaar werkwoord) in its infinitive form?

Return ONLY a JSON object (no markdown, no explanation) with this exact shape:
{"isSeparable": <true|false>, "correctedSpelling": <string or null>, "note": "<max 12 words>"}

Rules:
- "isSeparable" is true ONLY if "${infinitive}" is a real Dutch verb whose prefix SEPARATES in a main clause (e.g. opstaan → ik sta op).
- Inseparable-prefix verbs (be-, ver-, ont-, ge-, her-, er-, mis-, …) are NOT separable → false.
- Nouns, adjectives, conjugated forms, and non-Dutch words are NOT verbs → false.
- "correctedSpelling": if it is a clear misspelling of a real Dutch separable verb, give the correct infinitive; otherwise null.`;

  const text = await callClaude(prompt, 256);
  return JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)) as VerbCheck;
}

// ── Generate the exercise set via Claude ──────────────────────────────────────

async function generateSet(infinitive: string, retries = 2): Promise<GeneratedSet> {
  const prompt = `You are a Dutch language expert. Generate practice data for the Dutch separable verb "${infinitive}".

Return ONLY a JSON object (no markdown, no explanation) with exactly this shape:

{
  "infinitive": "<the Dutch infinitive, lowercase>",
  "english": "to <english meaning>",
  "translation_es": "<spanish infinitive translation>",
  "exercises": [
    { "context": "main",        "dutch": "<sentence with one ___>", "answer": "<fills ___>", "english": "<full sentence in English>", "translation_es": "<full sentence in Spanish>" },
    { "context": "perfect",     "dutch": "<sentence with one ___>", "answer": "<fills ___>", "english": "<full sentence in English>", "translation_es": "<full sentence in Spanish>" },
    { "context": "subordinate", "dutch": "<sentence with one ___>", "answer": "<fills ___>", "english": "<full sentence in English>", "translation_es": "<full sentence in Spanish>" },
    { "context": "modal",       "dutch": "<sentence with one ___>", "answer": "<fills ___>", "english": "<full sentence in English>", "translation_es": "<full sentence in Spanish>" }
  ]
}

There must be EXACTLY 4 exercises, one for each context, in this order: main, perfect, subordinate, modal.
Each "dutch" sentence contains EXACTLY ONE blank written as ___, and "answer" is EXACTLY the word(s) that replace ___ (single token, no surrounding words).

What each context tests (worked example for "opstaan" → to get up):
- "main":        main clause, present tense; the prefix SPLITS OFF to the very end. Blank = the SEPARATED PREFIX.
                 e.g. dutch "Ik sta elke ochtend om zes uur ___." , answer "op"
- "perfect":     present perfect (with ben/heb …); the PAST PARTICIPLE has ge- inside. Blank = the PARTICIPLE.
                 e.g. dutch "Ik ben vandaag vroeg ___." , answer "opgestaan"
- "subordinate": subordinate clause (omdat / dat / als / terwijl …); the verb stays TOGETHER, conjugated, at the END. Blank = the JOINED CONJUGATED verb.
                 e.g. dutch "Ik ben moe omdat ik elke dag vroeg ___." , answer "opsta"
- "modal":       with a modal (wil / moet / kan / mag …); the FULL INFINITIVE goes at the END. Blank = the INFINITIVE.
                 e.g. dutch "Ik moet morgen heel vroeg ___." , answer "opstaan"

Keep sentences short, natural and beginner-appropriate. Use standard Dutch spelling and grammar.`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const text = await callClaude(prompt, 2048);
      const parsed = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)) as GeneratedSet;
      validate(parsed, infinitive);
      return parsed;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (attempt < retries) {
        console.error(`  Attempt ${attempt + 1} failed: ${msg}. Retrying…`);
        await sleep(1000 * (attempt + 1));
      } else {
        throw e;
      }
    }
  }
  throw new Error('unreachable');
}

function validate(v: GeneratedSet, infinitive: string): void {
  if (!v.infinitive || !v.english || !v.translation_es || !Array.isArray(v.exercises)) {
    throw new Error('Generated data is missing required fields.');
  }
  if (v.exercises.length !== 4) throw new Error(`Expected 4 exercises, got ${v.exercises.length}.`);

  const seen = new Set<Context>();
  for (const ex of v.exercises) {
    if (!CONTEXTS.includes(ex.context)) throw new Error(`Bad context: ${ex.context}`);
    if (seen.has(ex.context)) throw new Error(`Duplicate context: ${ex.context}`);
    seen.add(ex.context);
    if (!ex.dutch || !ex.answer || !ex.english || !ex.translation_es) {
      throw new Error(`Exercise "${ex.context}" is missing fields.`);
    }
    const blanks = (ex.dutch.match(/___/g) ?? []).length;
    if (blanks !== 1) throw new Error(`Exercise "${ex.context}" must have exactly one ___ (found ${blanks}).`);
  }
  if (seen.size !== 4) throw new Error('Exercises must cover all four contexts.');

  // Soft sanity check that the model stayed on topic.
  if (v.infinitive.toLowerCase() !== infinitive.toLowerCase()) {
    console.warn(`  Note: requested "${infinitive}" but model returned "${v.infinitive}".`);
  }
}

// ── Add a single separable verb ───────────────────────────────────────────────

type AddResult = 'added' | 'exists' | 'not-verb' | 'error';

// Never calls process.exit — returns a status so a batch can keep going.
async function addOne(infinitive: string): Promise<AddResult> {
  // 1. Already in the DB?
  const { data: existing, error: lookupErr } = await supabase
    .from('separable_verb_sets').select('id, english').eq('infinitive', infinitive).maybeSingle();
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

  // 2. Verify it's a real Dutch separable verb before generating anything.
  try {
    const check = await verifySeparableVerb(infinitive);
    if (!check.isSeparable) {
      const suggestion = check.correctedSpelling?.trim().toLowerCase();
      if (suggestion && suggestion !== infinitive) {
        console.error(`  ✗ ${infinitive}: not a separable verb — did you mean "${suggestion}"?`);
      } else {
        console.error(`  ✗ ${infinitive}: not a Dutch separable verb${check.note ? ` (${check.note})` : ''}.`);
      }
      return 'not-verb';
    }
  } catch (e) {
    // Don't block on a transient verification failure — warn and continue.
    console.warn(`  ${infinitive}: could not verify (${e instanceof Error ? e.message : String(e)}); proceeding.`);
  }

  // 3. Generate the data.
  let gen: GeneratedSet;
  try {
    gen = await generateSet(infinitive);
  } catch (e) {
    console.error(`  ✗ ${infinitive}: generation failed: ${e instanceof Error ? e.message : String(e)}`);
    return 'error';
  }

  // 4. Insert the parent verb set first — exercises reference it via FK.
  const { data: inserted, error: setErr } = await supabase
    .from('separable_verb_sets')
    .insert({
      infinitive: gen.infinitive.toLowerCase(),
      english: gen.english,
      translation_es: gen.translation_es,
    })
    .select('id')
    .single();
  if (setErr || !inserted) {
    console.error(`  ✗ ${infinitive}: insert failed: ${setErr?.message ?? 'no row returned'}`);
    return 'error';
  }

  // 5. Insert the four exercises (unique per context via UNIQUE(verb_set_id, context)).
  const exerciseRows = gen.exercises.map(ex => ({
    verb_set_id: inserted.id,
    dutch: ex.dutch,
    english: ex.english,
    answer: ex.answer,
    context: ex.context,
    translation_es: ex.translation_es,
  }));
  const { error: exErr } = await supabase
    .from('separable_exercises')
    .upsert(exerciseRows, { onConflict: 'verb_set_id,context' });
  if (exErr) {
    // Roll back the orphaned parent so a retry can start clean.
    await supabase.from('separable_verb_sets').delete().eq('id', inserted.id);
    console.error(`  ✗ ${infinitive}: exercises failed (verb set rolled back): ${exErr.message}`);
    return 'error';
  }

  console.log(`  ✓ ${infinitive} → ${gen.english} (${gen.translation_es}) · 4 exercises [${CONTEXTS.join(', ')}]`);
  return 'added';
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Accept one or many verbs, separated by commas and/or spaces.
  const raw = process.argv.slice(2).join(' ').trim();
  const verbs = [...new Set(raw.split(/[\s,]+/).map(v => v.trim().toLowerCase()).filter(Boolean))];
  if (verbs.length === 0) {
    console.error('Usage: npx tsx --env-file=.env scripts/add-separable-verb.ts <verb>[, <verb> …]');
    console.error('Example: npm run add-separable-verb -- opstaan, aankomen, meenemen');
    process.exit(1);
  }

  if (!ANTHROPIC_KEY) {
    console.warn('Note: ANTHROPIC_API_KEY is not set — verbs not already in the DB cannot be generated.\n');
  }

  console.log(`Processing ${verbs.length} separable verb(s) with ${MODEL}: ${verbs.join(', ')}\n`);

  const counts: Record<AddResult, number> = { added: 0, exists: 0, 'not-verb': 0, error: 0 };
  for (const v of verbs) {
    counts[await addOne(v)] += 1;
  }

  console.log(`\nDone. added ${counts.added}, existing ${counts.exists}, not-a-verb ${counts['not-verb']}, errors ${counts.error}.`);
  process.exit(counts.error > 0 ? 1 : 0);
}

main();
