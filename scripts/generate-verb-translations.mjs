#!/usr/bin/env node
/**
 * Generates Spanish translations for all exercise sentences in verbs.ts.
 * Writes output to src/data/verbTranslations.ts.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-verb-translations.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VERBS_PATH = join(__dirname, '../src/data/verbs.ts');
const OUTPUT_PATH = join(__dirname, '../src/data/verbTranslations.ts');

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
  console.error('Get a key at https://console.anthropic.com and re-run:');
  console.error('  ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-verb-translations.mjs');
  process.exit(1);
}

// ── Extract English strings from verbs.ts ─────────────────────────────────

const content = readFileSync(VERBS_PATH, 'utf8');
const matches = [...content.matchAll(/english: '((?:[^'\\]|\\.)*)'/g)];
const all = matches.map(m => m[1].replace(/\\'/g, "'"));

const verbEnglish   = all.filter(s => s.startsWith('to '));
const exerciseSents = all.filter(s => !s.startsWith('to '));

console.log(`Found ${verbEnglish.length} verb strings and ${exerciseSents.length} exercise sentences.`);

// ── Translate via Anthropic API ───────────────────────────────────────────

async function translateBatch(sentences) {
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
}

// ── Main loop ─────────────────────────────────────────────────────────────

const BATCH = 50;
const exerciseMap = {};
const verbMap     = {};

// Translate exercise sentences
for (let i = 0; i < exerciseSents.length; i += BATCH) {
  const batch = exerciseSents.slice(i, i + BATCH);
  const end   = Math.min(i + BATCH, exerciseSents.length);
  process.stdout.write(`Exercise sentences ${i + 1}–${end} / ${exerciseSents.length} … `);

  let translated;
  try {
    translated = await translateBatch(batch);
    console.log('✓');
  } catch (e) {
    console.error(`\nFailed: ${e.message}. Skipping batch.`);
    batch.forEach(s => { exerciseMap[s] = s; }); // keep English as fallback
    continue;
  }

  batch.forEach((en, j) => { exerciseMap[en] = translated[j]; });

  if (i + BATCH < exerciseSents.length) {
    await new Promise(r => setTimeout(r, 400));
  }
}

// Translate verb-level strings ("to X")
for (let i = 0; i < verbEnglish.length; i += BATCH) {
  const batch = verbEnglish.slice(i, i + BATCH);
  const end   = Math.min(i + BATCH, verbEnglish.length);
  process.stdout.write(`Verb strings ${i + 1}–${end} / ${verbEnglish.length} … `);

  let translated;
  try {
    translated = await translateBatch(batch);
    console.log('✓');
  } catch (e) {
    console.error(`\nFailed: ${e.message}. Skipping batch.`);
    batch.forEach(s => { verbMap[s] = s; });
    continue;
  }

  batch.forEach((en, j) => { verbMap[en] = translated[j]; });

  if (i + BATCH < verbEnglish.length) {
    await new Promise(r => setTimeout(r, 400));
  }
}

// ── Write output ──────────────────────────────────────────────────────────

function escapeKey(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

const verbIds = [
  'stoeien','stuiteren','neuzen','gluren','fluisteren','gooien','springen','bakken',
  'wuiven','klimmen','eten','drinken','lopen','schrijven','lezen','vinden','geven',
  'nemen','vangen','vliegen','winnen','snijden','wassen','sluiten','zitten','kopen',
  'vragen','wonen','betalen','duwen','trekken','wachten','dansen','fietsen','duiken',
  'dromen','schilderen','bouwen','reizen','openen','beheren','behoren','wagen','storen',
  'bekennen','beven','weren','prijzen','beseffen','verwachten','ontdekken','verdwijnen',
  'bereiken','weigeren','overtuigen','verbergen','vergeten','kiezen','beginnen','vertrekken',
  'verliezen','geloven','proberen','ontmoeten','beloven','bedanken','feliciteren','veranderen',
  'verhuizen','bezoeken','ontvangen','sturen','bestellen','reserveren','repareren','beslissen',
  'regelen','controleren','verzamelen','organiseren','missen','tellen','meten','beschouwen',
  'bezitten','zweren','drijven','overwegen','erkennen','benadrukken','streven','bedriegen',
  'veronderstellen','beïnvloeden','weerstaan','overwinnen','beweren','bevestigen','weerleggen',
  'beoordelen','evalueren','analyseren','onderzoeken','concluderen','argumenteren','onderhandelen',
  'handhaven','verduidelijken','confronteren','motiveren','inspireren','tolereren','compenseren',
  'vertegenwoordigen','overleggen','ontwikkelen','implementeren','benaderen','specificeren',
  'pakken','houden','vallen','schudden','tillen','delen','knikken','ademen','blazen','doden',
  'steken','smaken','raken','redden','slaan','lijken','dreigen','tikken','schreeuwen','plakken',
  'schrikken','fronsen','slikken','piekeren','aarzelen','schuiven','slagen','pesten','schoppen',
  'zuchten','mompelen','rekenen','gokken','troosten','zeuren','rillen','aaien','bezorgen',
  'verraden','bewegen','verplaatsen','wijzen','begroeten','vechten','bepalen','besteden',
  'botsen','wisselen','veroorzaken','kruipen','veroveren','stellen','optellen','glimmen',
  'donderen','overschrijden','opstellen','uitvoeren','bezielen','afwijken','verstoppen',
  'verminderen','vergissen','ingrijpen','slopen','bevatten','verleggen','uitleggen','opsporen',
  'verstikken','beschuldigen','eisen','afgeven','oversteken','doorgaan','aanmelden','overtreden',
  'pikken','verslaan','uitmaken','versieren','verstoren','verzachten','jagen','opwerpen',
  'verkleden','afnemen','toenemen','verdenken','verslapen','verlangen','vastleggen','afspreken',
  'zwerven','maaien','snoeien','steunen','blijken','vervangen','schakelen','nadoen','pronken',
  'omgaan','overwinteren','verzinnen','nakijken','slippen','zaaien','verzetten','ontmoedigen',
  'juichen','draven','voorspellen','pruilen','sloven','aandringen','wenken','mopperen','kreunen',
  'buigen','uitputten','happen','schenken','popelen','gieten','braken','snuiven','overgaan',
  'afronden','neurien','aannemen','werpen','wrijven','verkreukelen','speuren','snauwen',
  'bemoeien','toekijken','volhouden','grinniken','schieten','wapperen','gebaren','opheffen',
  'zwijgen','schrapen','vreten','rukken','verwijzen','betrekken',
];

// Build verbTranslationsEs from the verb ID list + translated "to X" strings
// Note: we keep the existing hand-crafted verbTranslationsEs below as a fallback
const verbByEnglish = Object.fromEntries(verbEnglish.map((en, i) => [en, verbMap[en] ?? en]));

let lines = [];
lines.push(`import type { SupportedLang } from '../types';`);
lines.push('');
lines.push('// Verb-level Spanish translations (keyed by verb.id)');
lines.push('const verbTranslationsEs: Record<string, string> = {');
for (const id of verbIds) {
  const en = `to ${id}`;
  const es = verbByEnglish[en];
  if (es && !es.startsWith('to ')) {
    lines.push(`  ${id}: ${JSON.stringify(es)},`);
  }
}
lines.push('};');
lines.push('');
lines.push('// Exercise sentence Spanish translations (keyed by English sentence)');
lines.push('export const exerciseTranslationsEs: Record<string, string> = {');
for (const [en, es] of Object.entries(exerciseMap)) {
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
console.log(`  ${Object.keys(exerciseMap).length} exercise translations`);
console.log(`  ${Object.keys(verbByEnglish).length} verb translations`);
