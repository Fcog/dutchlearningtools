# Dutch Learning Tools — project guide for Claude

Vite + React (SPA, react-router) + Supabase (Postgres + Auth), deployed on Netlify.
Bilingual EN/ES. Site: https://dutchlearningtools.nl

## ✅ Checklist: adding a new exercise (ALWAYS follow every step)

When asked to create a new exercise module, do **all** of the following, then run
`npm run build` and confirm it's green.

### 1. Data layer
- `src/data/<name>Exercises.ts` — the exercise `interface` (+ any union types).
- `supabase/<name>_exercises.sql` — `CREATE TABLE IF NOT EXISTS`, enable RLS,
  public read policy, and add the new `exercise_type` to the
  `user_progress_exercise_type_check` constraint.
  - ⚠️ The constraint `CHECK` list must include **every existing exercise type**,
    not just the new one — re-adding a shorter list fails with error 23514 on
    existing rows. Keep the full list in sync.
- `scripts/migrate-<name>.ts` — seed rows (bilingual: `explanation` + `explanation_es`,
  and `translation_es` where relevant). Add `"migrate-<name>"` to `package.json` scripts.

### 2. Context + progress
- `src/context/DataContext.tsx` — add a `to<Name>Exercise` mapper, a state var,
  the `supabase.from('<table>')` query in the `Promise.all`, a **tolerated**
  `console.warn` on its error (don't `throw`), the setter call, and the value in
  the provider + the `DataContextValue` interface + the default context object.
- `src/hooks/useProgress.ts` — add the new value to the `ExerciseType` union.

### 3. Page
- `src/pages/<Name>Page.tsx` — follow the closest existing page (choice → clone
  `PrepositionsPage`; type-in → `PluralsPage`; tap → `WordOrderPage`).
- **No-repeat:** use `useExerciseDeck(list.length)` → `[index, advance]`; call
  `advance()` in `next()`. Do NOT reintroduce `useRandomStartIndex`/`randomIndex`.
- **Rules of Hooks:** call ALL hooks (`useCallback`, `useMemo`, `useEffect`,
  `useAdvanceOnEnter`) BEFORE any early `return` (loading / `!current`). Put the
  `if (loading || error) return …` and `if (!current) return …` guards *after* the
  hooks, and null-guard derived data. (Otherwise: React error #310 on hard refresh.)
- Route in `src/App.tsx`; home card in `src/pages/HomePage.tsx` (with `<StatsLine>`).

### 4. Translations (EN + ES)
- Add every UI string to BOTH `en` and `es` objects in `src/i18n/ui.ts`.
- Data explanations/glosses are bilingual (`*_es`). Never hardcode user-facing
  English in a component without an `es` path.

### 5. Listening feature
- Include `<SpeakButton text={() => …} />` (from `src/components/SpeakButton.tsx`).
  It reads Dutch only — never read the answer while unsolved, and never read a
  meaning/translation. Key it by `index` so audio stops on advance.

### 6. Mixed Practice + deep links + newsletter
- `src/components/mix/MixCards.tsx` — add the dataset to `PoolData` and
  `buildMixPool` (reuse `ChoiceCard` for choice-style; else a dedicated card),
  including `exerciseId` + `progressType` + `topic`.
- `src/pages/MixPage.tsx` — destructure the dataset, pass to `buildMixPool` (+ deps),
  add a `TOPIC_LABEL` entry. `SingleExercisePage.tsx` — same destructure + pool
  (this powers `/exercise/:type/:id` deep links used by the daily newsletter).

### 7. SEO (all three)
- `src/components/SeoManager.tsx` — add the route to `ROUTES` with a keyword-rich
  `title` + `description` (indexable). Private routes get `noindex: true`.
- `public/sitemap.xml` — add the URL.
- `package.json` → `reactSnap.include` — add the route so it's **prerendered**.

### 7b. Knowledge guide (ALWAYS create one)
Every new exercise MUST ship with a matching SEO knowledge guide — never add an
exercise without its guide.
- `src/data/guides.ts` — append a `Guide` to `GUIDES`: `slug` (`dutch-<topic>`),
  keyword-rich `title` + `description`, an `intro`, several `sections`
  (`heading` + `paragraphs` + optional `examples`), a few `faq` entries, and a
  `cta` pointing at the exercise route (`{ label: 'Practice … →', to: '/<route>' }`).
  Content is English (largest search market). `GuidesIndexPage` and
  `SeoManager` pick it up automatically from the array — no edits needed there.
- `public/sitemap.xml` — add `/guide/<slug>` at `<priority>0.9</priority>`.
- `package.json` → `reactSnap.include` — add `/guide/<slug>` so it's prerendered.

### 8. Privacy Policy + Terms of Use
- `src/pages/TermsOfUsePage.tsx` — keep §2 "Description of Service" accurate
  (mention the new topic area) and bump "Last updated".
- `src/pages/PrivacyPolicyPage.tsx` — bump "Last updated" if anything user-facing
  about data changed (usually no change needed for a new exercise).

### 9. Verify
- `npm run build` must pass (tsc is strict: `noUnusedLocals`/`noUnusedParameters`).
- Optionally `npm run prerender` (needs react-snap/Chromium) to confirm the new
  route prerenders with the right title/meta and 0 page errors.

## Conventions & gotchas
- `supabase` is cast `as any` for tables not in `src/types/database.ts` — follow
  that existing pattern rather than regenerating types.
- DataContext tolerates a missing table (warns, keeps app alive) — so a forgotten
  SQL migration shows as an empty exercise, not a crash.
- Build target is `es2019` (vite.config) so react-snap's Chromium can run the bundle.
- Newsletter/email content lives in `supabase/functions/daily-newsletter` and
  `newsletter-subscribe` (Deno + Resend); email shows the blanked prompt, never
  the answer. Signups use double opt-in.
- After finishing, tell the user the manual steps they must run: the SQL migration
  in Supabase, `npm run migrate-<name>`, and (for prerender in prod) the build command.

## Data that lives only in Supabase (not the repo)
Exercise content is seeded via the `migrate-*` scripts into Supabase tables; the
repo only holds the TypeScript types + seed scripts. To see content locally the
`.sql` must be run and the `migrate-*` script executed against the project.
