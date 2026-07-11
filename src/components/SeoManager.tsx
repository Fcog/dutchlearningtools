import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GUIDES } from '../data/guides';

const SITE = 'https://dutchlearningtools.nl';
const BRAND = 'Dutch Learning Tools';

interface Meta { title: string; description?: string; noindex?: boolean }

// Per-route SEO. Exercise pages are indexable landing pages; account/auth pages
// are noindex. Unknown routes fall back to the brand default.
const ROUTES: Record<string, Meta> = {
  '/': { title: BRAND, description: 'Free interactive exercises to learn Dutch grammar: verbs, articles, plurals, word order, prepositions, adjectives, idioms and more — with instant feedback.' },
  '/verbs-conjugation': { title: 'Dutch Verb Conjugation Practice', description: 'Practise Dutch verb conjugation in the present, simple past and present perfect with instant feedback.' },
  '/separable-verbs': { title: 'Dutch Separable Verbs Practice', description: 'Master when to split or keep Dutch separable verbs across main, perfect, subordinate and modal clauses.' },
  '/positional-verbs': { title: 'Dutch Position Verbs: staan, liggen, zitten, zijn', description: 'Learn when to use staan, liggen, zitten and zijn to describe where things are in Dutch.' },
  '/directional-adverbs': { title: 'Dutch Directional Adverbs', description: 'Tell voor-/achter- adverbs apart: vooraan, achteruit, achterop, achterom, naar voren and more.' },
  '/from-to': { title: 'Dutch From & To: vandaan, heen, toe', description: 'Choose vandaan, heen or toe to say where you come from and where you are going in Dutch.' },
  '/articles': { title: 'Dutch de / het Articles Practice', description: 'Practise choosing the correct definite article (de or het) for common Dutch nouns.' },
  '/plurals': { title: 'Dutch Plural Forms Practice', description: 'Practise Dutch plurals: -en, -s, -eren and irregular forms, with the article.' },
  '/word-order': { title: 'Dutch Word Order Practice', description: 'Rearrange scrambled words into correct Dutch sentences — the V2 rule, fronting and subordinate inversion.' },
  '/voorstellen': { title: 'The Dutch Verb voorstellen', description: 'Master every use of voorstellen: introduce, introduce yourself, imagine, suggest and represent.' },
  '/negation': { title: 'Dutch Negation: niet vs geen', description: 'Learn Dutch negation: choose niet or geen and place it correctly in the sentence.' },
  '/prepositions': { title: 'Dutch Fixed Prepositions', description: 'Learn which preposition each Dutch verb, adjective and noun takes: wachten op, bang voor, bestaan uit.' },
  '/er-prepositions': { title: 'Dutch Er + Preposition Practice (erin, eraan, erop)', description: 'Master Dutch pronominal adverbs: erin, eruit and erop for places, and eraan, erop, ervoor for verbs with a fixed preposition.' },
  '/modal-verbs': { title: 'Dutch Modal Verbs Practice (moeten, mogen, willen, kunnen)', description: 'Master the Dutch modal auxiliary verbs moeten, mogen, willen, zullen, hoeven and kunnen — choose the right modal in the present and simple past.' },
  '/time-prepositions': { title: 'Dutch Time Prepositions', description: 'Master om, op and in for clock times, days and months — plus na, tijdens, sinds, tot and over.' },
  '/expressions': { title: 'Dutch Idiomatic Expressions', description: 'Complete common Dutch idioms: in de gaten houden, de spijker op z’n kop slaan and more.' },
  '/adjectives': { title: 'Dutch Adjectives Practice', description: 'A whole section on Dutch adjectives: the -e ending rule, vocabulary, comparatives & superlatives, and opposites.' },
  '/adjectives/inflection': { title: 'Dutch Adjective Endings (-e rule)', description: 'Practise when a Dutch adjective takes -e: de grote man vs een groot huis.' },
  '/adjectives/vocab': { title: 'Dutch Adjectives Vocabulary', description: 'Learn what common Dutch adjectives mean.' },
  '/adjectives/degree': { title: 'Dutch Comparative & Superlative Adjectives', description: 'Form Dutch comparatives and superlatives: groter/grootst, beter/best, including irregulars.' },
  '/adjectives/opposite': { title: 'Dutch Adjective Opposites', description: 'Practise Dutch antonyms: groot ↔ klein, snel ↔ langzaam.' },
  '/diminutives': { title: 'Dutch Diminutives Practice (verkleinwoorden)', description: 'Practise Dutch diminutives — pick the right suffix: -je, -tje, -etje, -pje, -kje and irregular forms.' },
  '/mix': { title: 'Mixed Dutch Grammar Practice', description: 'A random exercise from every topic, one after another — the all-round Dutch workout.' },
  '/guides': { title: 'Dutch Grammar Guides', description: 'Free guides to Dutch grammar — de vs het, niet vs geen, diminutives, word order and more — each with interactive practice.' },
  '/privacy-policy': { title: 'Privacy Policy' },
  '/terms-of-use': { title: 'Terms of Use' },
  '/account': { title: 'Account', noindex: true },
  '/reset-password': { title: 'Reset Password', noindex: true },
  '/unsubscribe': { title: 'Unsubscribe', noindex: true },
  '/confirm-newsletter': { title: 'Confirm Subscription', noindex: true },
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function resolve(pathname: string): Meta {
  if (ROUTES[pathname]) return ROUTES[pathname];
  if (pathname.startsWith('/guide/')) {
    const g = GUIDES.find((x) => `/guide/${x.slug}` === pathname);
    if (g) return { title: g.title, description: g.description };
  }
  if (pathname.startsWith('/adjectives/')) return ROUTES['/adjectives'];
  if (pathname.startsWith('/exercise/')) return { title: 'Exercise', noindex: true };
  return { title: '404 — Page not found', noindex: true }; // catch-all / 404

}

export function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = resolve(pathname);
    const title = meta.title === BRAND ? BRAND : `${meta.title} · ${BRAND}`;
    const url = SITE + pathname;

    document.title = title;
    if (meta.description) upsertMeta('name', 'description', meta.description);
    upsertMeta('name', 'robots', meta.noindex ? 'noindex,follow' : 'index,follow');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = url;

    upsertMeta('property', 'og:title', title);
    if (meta.description) upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:url', url);
  }, [pathname]);

  return null;
}
