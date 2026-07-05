// Supabase Edge Function: delete-account
// Permanently deletes the calling user's account. Deleting the auth user
// cascades to user_progress and newsletter_subscriptions (both have
// ON DELETE CASCADE), which also removes them from the daily newsletter. We do
// not keep a contact list in Resend, so there is nothing to delete there.
//
// Deploy:  supabase functions deploy delete-account
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.)
//
// deno-lint-ignore-file no-explicit-any

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) return Response.json({ ok: false, error: 'missing-token' }, { status: 401, headers: CORS });

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Identify the caller from their JWT — a user can only delete themselves.
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return Response.json({ ok: false, error: 'invalid-token' }, { status: 401, headers: CORS });
    }
    const userId = userData.user.id;

    // Deleting the auth user cascades to user_progress + newsletter_subscriptions.
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      console.error('deleteUser failed', delErr);
      return Response.json({ ok: false, error: delErr.message }, { status: 500, headers: CORS });
    }

    return Response.json({ ok: true }, { headers: CORS });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, error: String(e) }, { status: 500, headers: CORS });
  }
});
