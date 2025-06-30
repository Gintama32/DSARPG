import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set up your Supabase project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          chapter_index: number;
          lesson_index: number;
          stage_index: number;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          chapter_index: number;
          lesson_index: number;
          stage_index: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          chapter_index?: number;
          lesson_index?: number;
          stage_index?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}