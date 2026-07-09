type Params = Record<string, string | number | boolean | undefined>;

/**
 * Send a Google Analytics (gtag) event. Safe no-op if gtag isn't loaded (e.g.
 * ad-blockers, local dev). Mark the important ones as conversions in the GA4 UI:
 *   - newsletter_signup    (homepage CTA submit / account opt-in)
 *   - newsletter_confirm   (double opt-in confirmed — the real conversion)
 *   - share                (score shared)
 */
export function track(event: string, params: Params = {}) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.('event', event, params);
}
