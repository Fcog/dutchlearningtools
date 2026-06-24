/**
 * One-time migration: loads all static data files and inserts them into Supabase.
 * Uses the service role key (bypasses RLS) — never expose this key in the frontend.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   npx tsx scripts/migrate-to-supabase.ts
 *
 * Safe to re-run — uses upsert (ON CONFLICT DO UPDATE).
 */

import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { verbs } from '../src/data/verbs.js';
import { separableVerbSets } from '../src/data/separableVerbs.js';
import { positionalExercises } from '../src/data/positionalVerbs.js';
import { exerciseTranslationsEs, getVerbTranslation } from '../src/data/verbTranslations.js';

const SUPABASE_URL             = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Required env vars: VITE_SUPABASE_URL (or SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY');
  console.error('Find both in your Supabase project → Settings → API');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws },
});

// ── Helpers ────────────────────────────────────────────────────────────────

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function upsert(table: string, rows: object[], conflict: string) {
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflict });
  if (error) throw new Error(`${table}: ${error.message}`);
}

// ── 1. Verbs ───────────────────────────────────────────────────────────────

console.log(`\nMigrating ${verbs.length} verbs…`);
for (const batch of chunk(verbs, 100)) {
  await upsert('verbs', batch.map(v => ({
    id:             v.id,
    infinitive:     v.infinitive,
    english:        v.english,
    translation_es: getVerbTranslation(v.id, 'es') ?? null,
    level:          v.level,
    auxiliary:      v.auxiliary,
    conjugation:    v.conjugation,
  })), 'id');
}
console.log('  ✓ verbs');

// ── 2. Exercises ───────────────────────────────────────────────────────────

const allExercises = verbs.flatMap(v =>
  v.exercises.map(ex => ({
    verb_id:        v.id,
    dutch:          ex.dutch,
    english:        ex.english,
    answer:         ex.answer,
    tense:          ex.tense,
    translation_es: exerciseTranslationsEs[ex.english] ?? null,
  }))
);

console.log(`Migrating ${allExercises.length} exercises…`);
for (const batch of chunk(allExercises, 200)) {
  await upsert('exercises', batch, 'verb_id,dutch');
}
console.log('  ✓ exercises');

// ── 3. Separable verb sets ─────────────────────────────────────────────────

console.log(`\nMigrating ${separableVerbSets.length} separable verb sets…`);
await upsert('separable_verb_sets', separableVerbSets.map(s => ({
  infinitive:     s.infinitive,
  english:        s.english,
  translation_es: s.translations?.es ?? null,
})), 'infinitive');

// Fetch inserted rows to get their UUIDs
const { data: insertedSets, error: setsErr } = await supabase
  .from('separable_verb_sets')
  .select('id, infinitive');
if (setsErr) throw setsErr;

const setIdByInfinitive = Object.fromEntries(
  (insertedSets ?? []).map(r => [r.infinitive, r.id])
);

const sepExercises = separableVerbSets.flatMap(s =>
  s.exercises.map(ex => ({
    verb_set_id:    setIdByInfinitive[s.infinitive],
    dutch:          ex.dutch,
    english:        ex.english,
    answer:         ex.answer,
    context:        ex.context,
    translation_es: ex.translations?.es ?? null,
  }))
);

console.log(`Migrating ${sepExercises.length} separable exercises…`);
await upsert('separable_exercises', sepExercises, 'verb_set_id,context');
console.log('  ✓ separable verbs');

// ── 4. Positional exercises ────────────────────────────────────────────────

console.log(`\nMigrating ${positionalExercises.length} positional exercises…`);
await upsert('positional_exercises', positionalExercises.map(ex => ({
  dutch:          ex.dutch,
  english:        ex.english,
  verb:           ex.verb,
  answer:         ex.answer,
  explanation:    ex.explanation,
  explanation_es: ex.explanationEs ?? null,
  level:          ex.level,
  translation_es: ex.translations?.es ?? null,
})), 'dutch');
console.log('  ✓ positional exercises');

// ── Done ───────────────────────────────────────────────────────────────────

console.log('\n✅ Migration complete.');
console.log(`   ${verbs.length} verbs`);
console.log(`   ${allExercises.length} exercises`);
console.log(`   ${separableVerbSets.length} separable verb sets  (${sepExercises.length} exercises)`);
console.log(`   ${positionalExercises.length} positional exercises`);
