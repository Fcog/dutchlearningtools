# SEO setup

## What's implemented
- **Static meta** in `index.html`: title, description, canonical, theme-color, Open Graph, Twitter Card, and `WebSite` JSON-LD.
- **Per-route meta** via `src/components/SeoManager.tsx` — sets a unique title, description, canonical, `og:*` and `robots` per route on navigation. Account/auth/transactional routes are `noindex`.
- **`public/robots.txt`** and **`public/sitemap.xml`** (indexable public routes only).
- **Bundle split** (`vite.config.ts`) — react / supabase in separate chunks for faster first load.
- **Hydration-ready entry** (`src/main.tsx`) — hydrates pre-rendered HTML if present, else mounts normally.

## ⚠️ Before going live — confirm these
1. **Domain**: everything hardcodes `https://dutchlearningtools.nl`. If the production domain differs, update `index.html`, `SeoManager.tsx`, `public/robots.txt`, `public/sitemap.xml`.
2. **OG image**: `index.html` references `/og-image.png`, which does **not exist yet**. Add a **1200×630** `public/og-image.png` (link previews will have no image until you do).
3. **Logo weight**: `src/assets/logo.png` is ~1.5 MB and loads on every page — compress/resize it (a big Core Web Vitals win).

## Pre-rendering (crawlers/social bots see real HTML)
This is the one piece not wired into `npm run build`, because it needs a headless Chromium (`react-snap` + Puppeteer) that must be installed in your environment.

```bash
npm i -D react-snap
npm run build       # produces dist/
npm run prerender   # react-snap crawls the routes in package.json "reactSnap".include
```

`npm run prerender` writes a static `index.html` per route into `dist/`, so each URL ships real HTML (title, meta, content) that non-JS crawlers can read. `main.tsx` already hydrates those snapshots.

- Config lives in `package.json` → `reactSnap` (route list + `--no-sandbox`).
- After prerender, deploy `dist/` as usual (Netlify).
- Alternative with zero code: enable **Netlify prerendering** in site settings (serves a rendered snapshot to bots only).

## Nice-to-have next
- Route-based `React.lazy` code-splitting to shrink initial JS further.
- Per-page `Course`/`FAQ` JSON-LD on the topic landing pages.
- `hreflang` tags if you serve EN and ES as separate URLs.
