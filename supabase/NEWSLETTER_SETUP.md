# Daily exercise newsletter — setup

Registered users can opt in to a daily email with one random exercise; the email
mimics the exercise and links back to the site to answer it.

## Pieces
- **Frontend** (already built): opt-in toggle at `/account`, deep link `/exercise/:type/:id`, and `/unsubscribe`.
- **DB**: `newsletter_subscriptions`, `daily_exercise`, and the `unsubscribe_newsletter` RPC — in `newsletter.sql`.
- **Edge function**: `functions/daily-newsletter` picks the global exercise of the day and sends it via Resend.

## 1. Database
Run `newsletter.sql` in the Supabase SQL editor.

## 2. Email provider (Resend)
1. Create a Resend account and **verify your sending domain** (add the SPF/DKIM DNS records Resend gives you). Deliverability depends on this.
2. Create an API key.
3. Pick a From address on the verified domain, e.g. `Dutch Tools <daily@yourdomain.com>`.
   (Before the domain verifies you can test with `onboarding@resend.dev`.)

## 3. Deploy the function + secrets
```bash
supabase functions deploy daily-newsletter --no-verify-jwt
supabase secrets set \
  RESEND_API_KEY=re_xxx \
  FROM_EMAIL="Dutch Tools <daily@yourdomain.com>" \
  SITE_URL="https://yourdomain.com"
```
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.

Test it once (it will pick today's exercise and email current opt-ins):
```bash
curl -X POST "$SUPABASE_URL/functions/v1/daily-newsletter" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

## 4. Schedule it daily (pg_cron + pg_net)
In the SQL editor (enable the `pg_cron` and `pg_net` extensions first, under Database → Extensions):
```sql
select cron.schedule(
  'daily-newsletter',
  '0 11 * * *',                              -- 11:00 UTC every day
  $$
  select net.http_post(
    url     := 'https://<PROJECT_REF>.supabase.co/functions/v1/daily-newsletter',
    headers := jsonb_build_object(
      'Authorization', 'Bearer <SERVICE_ROLE_KEY>',
      'Content-Type', 'application/json'
    )
  );
  $$
);
```
Change `0 7 * * *` to your preferred send time (UTC). To remove: `select cron.unschedule('daily-newsletter');`.

## Notes
- **Global pick**: everyone gets the same exercise of the day (stored in `daily_exercise`, so re-running is idempotent). Switch to per-user later by picking inside the subscriber loop.
- **Compliance**: every email includes a one-click unsubscribe link (token-based, no login). Add a physical mailing address to the footer if required in your jurisdiction (CAN-SPAM).
- **Email is not interactive** — answering happens on the site via the deep link, by design.
