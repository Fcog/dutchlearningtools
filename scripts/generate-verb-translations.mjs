#!/usr/bin/env node
/**
 * Generates Spanish translations for all exercise sentences in verbs.ts.
 * Incremental: reads existing verbTranslations.ts and skips already-translated entries.
 * Writes output to src/data/verbTranslations.ts.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-verb-translations.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VERBS_PATH   = join(__dirname, '../src/data/verbs.ts');
const OUTPUT_PATH  = join(__dirname, '../src/data/verbTranslations.ts');

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
  console.error('Get a key at https://console.anthropic.com and re-run:');
  console.error('  ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-verb-translations.mjs');
  process.exit(1);
}

// ── Extract English strings from verbs.ts ─────────────────────────────────

const content = readFileSync(VERBS_PATH, 'utf8');

// Extract (id, english) pairs for verbs — e.g. { id: 'stoeien', english: 'to roughhouse / to frolic' }
const verbPairs = [...content.matchAll(/id:\s*'(\w+)'[^{}]*?english:\s*'(to [^']+)'/gs)]
  .map(m => ({ id: m[1], english: m[2].replace(/\\'/g, "'") }));

// All english: '...' values that are NOT verb-level strings
const allMatches = [...content.matchAll(/english: '((?:[^'\\]|\\.)*)'/g)];
const allEnglish = allMatches.map(m => m[1].replace(/\\'/g, "'"));
const verbEnglishSet = new Set(verbPairs.map(v => v.english));
const exerciseSents = allEnglish.filter(s => !verbEnglishSet.has(s));

console.log(`Found ${verbPairs.length} verb entries and ${exerciseSents.length} exercise sentences.`);

// ── Load existing translations (skip good ones) ───────────────────────────

let existingExerciseMap = {};
let existingVerbMap = {};

try {
  const existing = readFileSync(OUTPUT_PATH, 'utf8');

  // Extract exerciseTranslationsEs entries
  const exMatch = existing.match(/export const exerciseTranslationsEs[^=]*=\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/s);
  if (exMatch) {
    const pairs = [...exMatch[1].matchAll(/"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g)];
    for (const [, k, v] of pairs) {
      const key = k.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      const val = v.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      if (key !== val) existingExerciseMap[key] = val; // skip English-valued entries
    }
  }

  // Extract verbTranslationsEs entries
  const vbMatch = existing.match(/const verbTranslationsEs[^=]*=\s*\{([^}]*)\}/s);
  if (vbMatch) {
    const pairs = [...vbMatch[1].matchAll(/(\w+)\s*:\s*"((?:[^"\\]|\\.)*)"/g)];
    for (const [, k, v] of pairs) {
      existingVerbMap[k] = v;
    }
  }

  console.log(`Loaded ${Object.keys(existingExerciseMap).length} existing exercise translations.`);
  console.log(`Loaded ${Object.keys(existingVerbMap).length} existing verb translations.`);
} catch {
  console.log('No existing translation file found, starting fresh.');
}

// ── Determine what still needs translation ────────────────────────────────

const exercisesToTranslate = exerciseSents.filter(s => !existingExerciseMap[s]);
const verbsToTranslate     = verbPairs.filter(v => !existingVerbMap[v.id]);

console.log(`Need to translate: ${exercisesToTranslate.length} exercise sentences, ${verbsToTranslate.length} verb strings.`);

if (exercisesToTranslate.length === 0 && verbsToTranslate.length === 0) {
  console.log('Nothing to do — all translations already exist.');
  process.exit(0);
}

// ── Translate via Anthropic API ───────────────────────────────────────────

async function translateBatch(sentences, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          messages: [{
            role: 'user',
            content:
              'Translate each sentence to Spanish. Return ONLY a JSON array of strings, ' +
              'same length and same order as the input. No explanations, no markdown.\n\n' +
              'Input: ' + JSON.stringify(sentences),
          }],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`API error ${res.status}: ${err}`);
      }

      const data = await res.json();
      const text = data.content[0].text.trim();
      const start = text.indexOf('[');
      const end   = text.lastIndexOf(']') + 1;
      const parsed = JSON.parse(text.slice(start, end));

      if (parsed.length !== sentences.length) {
        throw new Error(`Batch length mismatch: sent ${sentences.length}, got ${parsed.length}`);
      }
      return parsed;
    } catch (e) {
      if (attempt < retries) {
        console.error(`  Attempt ${attempt + 1} failed: ${e.message}. Retrying…`);
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      } else {
        throw e;
      }
    }
  }
}

// ── Main loop ─────────────────────────────────────────────────────────────

const BATCH = 50;
const newExerciseMap = { ...existingExerciseMap };
const newVerbMap     = { ...existingVerbMap };
let failed = 0;

// Translate exercise sentences
for (let i = 0; i < exercisesToTranslate.length; i += BATCH) {
  const batch = exercisesToTranslate.slice(i, i + BATCH);
  const end   = Math.min(i + BATCH, exercisesToTranslate.length);
  process.stdout.write(`Exercise sentences ${i + 1}–${end} / ${exercisesToTranslate.length} … `);

  try {
    const translated = await translateBatch(batch);
    batch.forEach((en, j) => { newExerciseMap[en] = translated[j]; });
    console.log('✓');
  } catch (e) {
    console.error(`\nFailed after retries: ${e.message}. Skipping batch (will retry next run).`);
    failed += batch.length;
  }

  if (i + BATCH < exercisesToTranslate.length) {
    await new Promise(r => setTimeout(r, 400));
  }
}

// Translate verb-level strings (keyed by verb ID)
for (let i = 0; i < verbsToTranslate.length; i += BATCH) {
  const batch = verbsToTranslate.slice(i, i + BATCH);
  const end   = Math.min(i + BATCH, verbsToTranslate.length);
  process.stdout.write(`Verb strings ${i + 1}–${end} / ${verbsToTranslate.length} … `);

  try {
    const translated = await translateBatch(batch.map(v => v.english));
    batch.forEach((v, j) => { newVerbMap[v.id] = translated[j]; });
    console.log('✓');
  } catch (e) {
    console.error(`\nFailed after retries: ${e.message}. Skipping batch (will retry next run).`);
    failed += batch.length;
  }

  if (i + BATCH < verbsToTranslate.length) {
    await new Promise(r => setTimeout(r, 400));
  }
}

// ── Write output ──────────────────────────────────────────────────────────

let lines = [];
lines.push(`import type { SupportedLang } from '../types';`);
lines.push('');
lines.push('// Verb-level Spanish translations (keyed by verb.id)');
lines.push('const verbTranslationsEs: Record<string, string> = {');
for (const [id, es] of Object.entries(newVerbMap)) {
  lines.push(`  ${id}: ${JSON.stringify(es)},`);
}
lines.push('};');
lines.push('');
lines.push('// Exercise sentence Spanish translations (keyed by English sentence)');
lines.push('export const exerciseTranslationsEs: Record<string, string> = {');
for (const [en, es] of Object.entries(newExerciseMap)) {
  lines.push(`  ${JSON.stringify(en)}: ${JSON.stringify(es)},`);
}
lines.push('};');
lines.push('');
lines.push('export function getVerbTranslation(verbId: string, lang: SupportedLang): string | undefined {');
lines.push("  if (lang === 'es') return verbTranslationsEs[verbId];");
lines.push('  return undefined;');
lines.push('}');
lines.push('');
lines.push('export function getExerciseTranslation(english: string, lang: SupportedLang): string | undefined {');
lines.push("  if (lang === 'es') return exerciseTranslationsEs[english];");
lines.push('  return undefined;');
lines.push('}');
lines.push('');

writeFileSync(OUTPUT_PATH, lines.join('\n'));
console.log(`\nDone. Written to ${OUTPUT_PATH}`);
console.log(`  ${Object.keys(newExerciseMap).length} exercise translations`);
console.log(`  ${Object.keys(newVerbMap).length} verb translations`);
if (failed > 0) {
  console.log(`  ${failed} sentences skipped due to API errors — re-run to retry them`);
}
