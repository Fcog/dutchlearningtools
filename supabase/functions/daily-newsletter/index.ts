// Supabase Edge Function: daily-newsletter
// Picks one global "exercise of the day", then emails it (via Resend) to every
// opted-in subscriber, with a button that opens the exercise on the site.
//
// Deploy:  supabase functions deploy daily-newsletter
// Secrets: supabase secrets set RESEND_API_KEY=... FROM_EMAIL="Dutch Tools <daily@yourdomain>" SITE_URL=https://yourdomain
// Schedule: see ../../NEWSLETTER_SETUP.md
//
// deno-lint-ignore-file no-explicit-any

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'Dutch Tools <onboarding@resend.dev>';
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://learndutch.example').replace(/\/$/, '');

// exercise_type  →  table it lives in
const TABLES: Record<string, string> = {
  verb: 'exercises',
  separable: 'separable_exercises',
  positional: 'positional_exercises',
  directional: 'directional_exercises',
  'from-to': 'from_to_exercises',
  preposition: 'preposition_exercises',
  'time-prep': 'time_prep_exercises',
  article: 'article_nouns',
  plural: 'plural_nouns',
  'word-order': 'word_order_sentences',
  voorstellen: 'voorstellen_exercises',
  negation: 'negation_exercises',
};

const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

/** Fetch one random row from a table using the count+offset trick. */
async function randomRow(table: string): Promise<any | null> {
  const { count } = await admin.from(table).select('*', { count: 'exact', head: true });
  if (!count) return null;
  const offset = Math.floor(Math.random() * count);
  const { data } = await admin.from(table).select('*').range(offset, offset);
  return data?.[0] ?? null;
}

/** Return today's {type, id, row}, picking + persisting one if not chosen yet. */
async function exerciseOfTheDay() {
  const day = new Date().toISOString().slice(0, 10);
  const { data: existing } = await admin.from('daily_exercise').select('*').eq('day', day).maybeSingle();

  if (existing) {
    const row = (await admin.from(TABLES[existing.exercise_type]).select('*').eq('id', existing.exercise_id).maybeSingle()).data;
    if (row) return { type: existing.exercise_type as string, id: existing.exercise_id as string, row };
  }

  // Pick a random topic, then a random row within it.
  const types = Object.keys(TABLES);
  for (const type of shuffle(types)) {
    const row = await randomRow(TABLES[type]);
    if (row) {
      await admin.from('daily_exercise').upsert({ day, exercise_type: type, exercise_id: String(row.id) }, { onConflict: 'day' });
      return { type, id: String(row.id), row };
    }
  }
  return null;
}

function promptDutch(type: string, row: any): string {
  if (type === 'word-order') return '';
  if (row.dutch) return row.dutch;
  if (row.gapped) return row.gapped;
  if (row.noun) return `___ ${row.noun}`;
  if (row.singular) return `${row.article} ${row.singular}`;
  return '';
}

function optionChips(type: string, row: any): string[] {
  if (type === 'article') return ['de', 'het'];
  if (type === 'positional') return ['zijn', 'zitten', 'liggen', 'staan'];
  if (type === 'word-order' && Array.isArray(row.words)) return shuffle(row.words);
  if (Array.isArray(row.options)) return row.options;
  if (Array.isArray(row.bank)) return row.bank;
  return [];
}

const T = {
  en: { of_the_day: 'Your Dutch exercise of the day', prompt: 'What goes in the blank?', cta: 'Answer on the website', footer: 'You get this because you opted in to the daily exercise email.', unsub: 'Unsubscribe' },
  es: { of_the_day: 'Tu ejercicio de neerlandés del día', prompt: '¿Qué va en el hueco?', cta: 'Responder en el sitio', footer: 'Recibes esto porque te suscribiste al ejercicio diario por correo.', unsub: 'Darse de baja' },
};

function renderEmail(type: string, row: any, lang: 'en' | 'es', unsubToken: string): { subject: string; html: string } {
  const t = T[lang];
  const english = (lang === 'es' ? row.translation_es : null) ?? row.english ?? '';
  const dutch = promptDutch(type, row);
  const chips = optionChips(type, row);
  const answerUrl = `${SITE_URL}/exercise/${encodeURIComponent(type)}/${encodeURIComponent(String(row.id))}`;
  const unsubUrl = `${SITE_URL}/unsubscribe?token=${encodeURIComponent(unsubToken)}`;
  const level = row.level ? `<span style="font-size:12px;font-weight:700;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:999px;">${row.level}</span>` : '';

  const chipsHtml = chips.length
    ? `<div style="margin:16px 0;">${chips.map((c) => `<span style="display:inline-block;border:1.5px solid #e5e7eb;border-radius:999px;padding:6px 14px;margin:0 6px 8px 0;font-size:15px;color:#111827;">${c}</span>`).join('')}</div>`
    : '';

  const dutchHtml = dutch
    ? `<p style="font-size:20px;line-height:1.5;color:#111827;margin:8px 0 4px;">${dutch.replace('___', '<span style="color:#9ca3af;font-weight:700;">_____</span>')}</p>`
    : '';

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
    <p style="font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#6b7280;margin:0 0 4px;">${t.of_the_day}</p>
    <div style="border:1.5px solid #e5e7eb;border-radius:14px;padding:20px;">
      ${level}
      <p style="font-size:14px;color:#6b7280;margin:12px 0 2px;">${t.prompt}</p>
      ${dutchHtml}
      <p style="font-size:15px;color:#6b7280;font-style:italic;margin:6px 0 0;">${english}</p>
      ${chipsHtml}
      <a href="${answerUrl}" style="display:inline-block;margin-top:8px;background:#2563eb;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:10px;">${t.cta} →</a>
    </div>
    <p style="font-size:12px;color:#9ca3af;margin:20px 0 0;line-height:1.5;">${t.footer}<br/>
      <a href="${unsubUrl}" style="color:#9ca3af;">${t.unsub}</a>
    </p>
  </div>`;

  return { subject: `🇳🇱 ${t.of_the_day}`, html };
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

Deno.serve(async (req) => {
  try {
    const daily = await exerciseOfTheDay();
    if (!daily) return Response.json({ ok: false, error: 'no-exercises' }, { status: 500 });

    // Idempotency guard: atomically claim today's send. The UPDATE only affects
    // the row while sent_at IS NULL, so exactly one invocation per day "wins" and
    // proceeds; any later invocation gets zero rows back and skips sending.
    // Pass ?force=1 to bypass (for testing).
    const force = new URL(req.url).searchParams.get('force') === '1';
    if (!force) {
      const day = new Date().toISOString().slice(0, 10);
      const { data: claim, error: claimErr } = await admin
        .from('daily_exercise')
        .update({ sent_at: new Date().toISOString() })
        .eq('day', day)
        .is('sent_at', null)
        .select('day');
      // A DB error (e.g. the sent_at column/migration is missing) must NOT be
      // mistaken for "already sent" — surface it instead of silently skipping.
      if (claimErr) {
        console.error('send-claim failed', claimErr);
        return Response.json({ ok: false, error: `claim: ${claimErr.message}` }, { status: 500 });
      }
      if (!claim || claim.length === 0) {
        return Response.json({ ok: true, skipped: 'already-sent-today', exercise: { type: daily.type, id: daily.id } });
      }
    }

    const { data: subs } = await admin
      .from('newsletter_subscriptions')
      .select('email, lang, unsubscribe_token')
      .eq('opted_in', true);

    let sent = 0, failed = 0;
    for (const s of subs ?? []) {
      try {
        const { subject, html } = renderEmail(daily.type, daily.row, (s.lang === 'es' ? 'es' : 'en'), s.unsubscribe_token);
        await sendEmail(s.email, subject, html);
        sent++;
      } catch (e) {
        console.error('send failed', s.email, e);
        failed++;
      }
    }

    return Response.json({ ok: true, exercise: { type: daily.type, id: daily.id }, subscribers: subs?.length ?? 0, sent, failed });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
});
