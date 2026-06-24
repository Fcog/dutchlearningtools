import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

export type ExerciseType = 'verb' | 'separable' | 'positional';

export interface ModuleStats {
  total: number;
  correct: number;
}

type ProgressRow = Database['public']['Tables']['user_progress']['Row'];

export function useProgress() {
  const { user } = useAuth();

  const recordAnswer = async (exerciseId: string | undefined, type: ExerciseType, correct: boolean) => {
    if (!user || !exerciseId) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('exercise_id', exerciseId)
      .maybeSingle() as { data: ProgressRow | null };

    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('user_progress')
        .update({
          correct_count: existing.correct_count + (correct ? 1 : 0),
          total_count: existing.total_count + 1,
          last_seen: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('user_progress').insert({
        user_id: user.id,
        exercise_id: exerciseId,
        exercise_type: type,
        correct_count: correct ? 1 : 0,
        total_count: 1,
      });
    }
  };

  const fetchModuleStats = async (type: ExerciseType): Promise<ModuleStats | null> => {
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('exercise_type', type) as { data: ProgressRow[] | null };

    if (!data || data.length === 0) return null;

    return {
      total: data.reduce((sum, r) => sum + r.total_count, 0),
      correct: data.reduce((sum, r) => sum + r.correct_count, 0),
    };
  };

  return { recordAnswer, fetchModuleStats };
}
