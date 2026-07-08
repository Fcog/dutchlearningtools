// Supabase Edge Function: newsletter-subscribe
// Public homepage CTA sign-up with anti-abuse:
//   - honeypot field (bots that fill it are silently dropped)
//   - server-side email validation
//   - per-IP rate limiting
//   - unique email (ON CONFLICT DO NOTHING)
//   - double opt-in: the email is stored unconfirmed and only receives the
//     newsletter after the owner clicks the confirmation link — so a bot cannot
//     actually subscribe other people.
//
// Deploy: supabase functions deploy newsletter-subscribe --no-verify-jwt
// (uses the same RESEND_API_KEY / FROM_EMAIL / SITE_URL secrets as daily-newsletter)
//
// deno-lint-ignore-file no-explicit-any

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'Dutch Tools <onboarding@resend.dev>';
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://learndutch.example').replace(/\/$/, '');

const RATE_LIMIT = 5;          // max sign-ups per IP…
const RATE_WINDOW_MIN = 60;    // …per this many minutes
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

const T = {
  en: { subject: 'Confirm your Dutch daily exercise', lead: 'Almost there!', body: 'Tap below to confirm your subscription to the daily Dutch exercise email.', cta: 'Confirm subscription', ignore: "If you didn't request this, just ignore this email." },
  es: { subject: 'Confirma tu ejercicio diario de neerlandés', lead: '¡Ya casi!', body: 'Pulsa abajo para confirmar tu suscripción al ejercicio diario por correo.', cta: 'Confirmar suscripción', ignore: 'Si no lo solicitaste, ignora este correo.' },
};

function confirmEmailHtml(lang: 'en' | 'es', token: string) {
  const t = T[lang];
  const url = `${SITE_URL}/confirm-newsletter?token=${encodeURIComponent(token)}`;
  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
    <p style="font-size:18px;font-weight:700;color:#111827;margin:0 0 8px;">${t.lead}</p>
    <p style="font-size:15px;color:#374151;margin:0 0 20px;">${t.body}</p>
    <a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:10px;">${t.cta} →</a>
    <p style="font-size:12px;color:#9ca3af;margin:24px 0 0;">${t.ignore}</p>
  </div>`;
  return { subject: t.subject, html };
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
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const { email: rawEmail, lang: rawLang, website } = await req.json().catch(() => ({}));

    // Honeypot: real users never fill this hidden field. Pretend success.
    if (typeof website === 'string' && website.trim() !== '') return json({ ok: true });

    const email = String(rawEmail ?? '').trim().toLowerCase();
    const lang = rawLang === 'es' ? 'es' : 'en';
    if (!EMAIL_RE.test(email) || email.length > 320) return json({ ok: false, error: 'invalid-email' }, 400);

    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';

    // Per-IP rate limit.
    const since = new Date(Date.now() - RATE_WINDOW_MIN * 60_000).toISOString();
    const { count } = await admin
      .from('newsletter_signups')
      .select('*', { count: 'exact', head: true })
      .eq('ip', ip)
      .gte('created_at', since);
    if ((count ?? 0) >= RATE_LIMIT) return json({ ok: false, error: 'rate-limited' }, 429);

    // Already signed up?
    const { data: existing } = await admin
      .from('newsletter_signups')
      .select('confirmed, confirm_token')
      .eq('email', email)
      .maybeSingle();

    if (existing?.confirmed) return json({ ok: true, already: true });

    let token = existing?.confirm_token as string | undefined;
    if (!existing) {
      const { data: inserted, error } = await admin
        .from('newsletter_signups')
        .insert({ email, lang, ip })
        .select('confirm_token')
        .single();
      if (error) return json({ ok: false, error: error.message }, 500);
      token = inserted.confirm_token;
    }

    // Send (or re-send) the double opt-in confirmation.
    const { subject, html } = confirmEmailHtml(lang, token!);
    await sendEmail(email, subject, html);

    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return json({ ok: false, error: String(e) }, 500);
  }
});
