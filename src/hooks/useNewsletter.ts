import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { SupportedLang } from '../types';

export interface Subscription {
  opted_in: boolean;
  lang: SupportedLang;
}

/**
 * Read and update the current user's daily-newsletter opt-in. Backed by the
 * `newsletter_subscriptions` table (RLS restricts every row to its owner).
 */
export function useNewsletter() {
  const { user } = useAuth();

  const getSubscription = async (): Promise<Subscription | null> => {
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('newsletter_subscriptions')
      .select('opted_in, lang')
      .eq('user_id', user.id)
      .maybeSingle();
    return data ? { opted_in: data.opted_in, lang: data.lang } : null;
  };

  const saveSubscription = async (optedIn: boolean, lang: SupportedLang): Promise<{ error: string | null }> => {
    if (!user) return { error: 'not-authenticated' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('newsletter_subscriptions')
      .upsert(
        { user_id: user.id, email: user.email, opted_in: optedIn, lang },
        { onConflict: 'user_id' },
      );
    return { error: error?.message ?? null };
  };

  return { getSubscription, saveSubscription };
}
