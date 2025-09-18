// types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      pillars: {
        Row: {
          id: string;
          ref_code: string;
          name: string;
          description: string | null;
          sort_order: number | null;
        };
      };
      themes: {
        Row: {
          id: string;
          ref_code: string;
          pillar_id: string;
          pillar_code: string;
          name: string;
          description: string | null;
          sort_order: number | null;
        };
      };
      subthemes: {
        Row: {
          id: string;
          ref_code: string;
          theme_id: string;
          theme_code: string;
          name: string;
          description: string | null;
          sort_order: number | null;
        };
      };
      indicators: {
        Row: {
          id: string;
          ref_code: string;
          subtheme_id: string;
          name: string;
          description: string | null;
          level: string | null;
          sort_order: number | null;
        };
      };
      criteria_levels: {
        Row: {
          id: number;
          indicator_id: string;
          label: string;
          default_score: number | null;
          sort_order: number | null;
        };
      };
    };
    Views: {
      v_framework_flat: {
        Row: {
          pillar_ref_code: string | null;
          pillar_name: string | null;
          theme_ref_code: string | null;
          theme_name: string | null;
          subtheme_ref_code: string | null;
          subtheme_name: string | null;
          indicator_ref_code: string | null;
          indicator_name: string | null;
        };
      };
      v_full_framework: {
        Row: Record<string, unknown>;
      };
      vw_levels: {
        Row: Record<string, unknown>;
      };
    };
  };
}
