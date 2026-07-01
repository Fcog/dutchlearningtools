export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      verbs: {
        Row: {
          id: string;
          infinitive: string;
          english: string;
          translation_es: string | null;
          level: 'A1' | 'A2' | 'B1';
          auxiliary: 'hebben' | 'zijn';
          conjugation: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['verbs']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['verbs']['Insert']>;
      };
      exercises: {
        Row: {
          id: string;
          verb_id: string;
          dutch: string;
          english: string;
          answer: string;
          tense: 'present' | 'past' | 'perfect';
          translation_es: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['exercises']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['exercises']['Insert']>;
      };
      separable_verb_sets: {
        Row: {
          id: string;
          infinitive: string;
          english: string;
          translation_es: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['separable_verb_sets']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['separable_verb_sets']['Insert']>;
      };
      separable_exercises: {
        Row: {
          id: string;
          verb_set_id: string;
          dutch: string;
          english: string;
          answer: string;
          context: 'main' | 'perfect' | 'subordinate' | 'modal';
          translation_es: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['separable_exercises']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['separable_exercises']['Insert']>;
      };
      positional_exercises: {
        Row: {
          id: string;
          dutch: string;
          english: string;
          verb: 'zijn' | 'zitten' | 'liggen' | 'staan';
          answer: string;
          explanation: string;
          explanation_es: string | null;
          level: 'A1' | 'A2' | 'B1';
          translation_es: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['positional_exercises']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['positional_exercises']['Insert']>;
      };
      directional_exercises: {
        Row: {
          id: string;
          dutch: string;
          english: string;
          answer: string;
          options: Json;
          explanation: string;
          explanation_es: string | null;
          level: 'A1' | 'A2' | 'B1';
          translation_es: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['directional_exercises']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['directional_exercises']['Insert']>;
      };
      from_to_exercises: {
        Row: {
          id: string;
          dutch: string;
          english: string;
          answer: string;
          options: Json;
          explanation: string;
          explanation_es: string | null;
          level: 'A1' | 'A2' | 'B1';
          translation_es: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['from_to_exercises']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['from_to_exercises']['Insert']>;
      };
      article_nouns: {
        Row: {
          id: string;
          noun: string;
          article: 'de' | 'het';
          english: string;
          translation_es: string | null;
          level: 'A1' | 'A2' | 'B1';
          tip: string | null;
          tip_es: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['article_nouns']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['article_nouns']['Insert']>;
      };
      plural_nouns: {
        Row: {
          id: string;
          singular: string;
          article: 'de' | 'het';
          plural: string;
          plural_type: 'en' | 's' | 'eren' | 'irregular';
          english: string;
          translation_es: string | null;
          tip: string | null;
          tip_es: string | null;
          level: 'A1' | 'A2' | 'B1';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['plural_nouns']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['plural_nouns']['Insert']>;
      };
      word_order_sentences: {
        Row: {
          id: string;
          words: string[];
          english: string;
          translation_es: string | null;
          rule: 'v2' | 'v2-fronting' | 'subordinate' | 'modal' | 'perfect';
          explanation: string;
          explanation_es: string | null;
          level: 'A1' | 'A2' | 'B1';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['word_order_sentences']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['word_order_sentences']['Insert']>;
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          exercise_type: 'verb' | 'separable' | 'positional' | 'article' | 'plural' | 'word-order';
          correct_count: number;
          total_count: number;
          last_seen: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_progress']['Row'], 'id' | 'last_seen' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_progress']['Insert']>;
      };
    };
  };
}
