export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      pillars: {
        Row: {
          id: string; // uuid
          ref_code: string;
          name: string;
          description: string | null;
          sort_order: number | null;
        };
        Insert: {
          id?: string;
          ref_code: string;
          name: string;
          description?: string | null;
          sort_order?: number | null;
        };
        Update: {
          id?: string;
          ref_code?: string;
          name?: string;
          description?: string | null;
          sort_order?: number | null;
        };
      };
      themes: {
        Row: {
          id: string; // uuid
          ref_code: string;
          pillar_code: string;
          name: string;
          description: string | null;
          sort_order: number | null;
          pillar_id: string; // uuid (FK → pillars.id)
        };
        Insert: {
          id?: string;
          ref_code: string;
          pillar_code: string;
          name: string;
          description?: string | null;
          sort_order?: number | null;
          pillar_id: string;
        };
        Update: {
          id?: string;
          ref_code?: string;
          pillar_code?: string;
          name?: string;
          description?: string | null;
          sort_order?: number | null;
          pillar_id?: string;
        };
      };
      subthemes: {
        Row: {
          id: string; // uuid
          ref_code: string;
          theme_code: string;
          name: string;
          description: string | null;
          sort_order: number | null;
          theme_id: string; // uuid (FK → themes.id)
        };
        Insert: {
          id?: string;
          ref_code: string;
          theme_code: string;
          name: string;
          description?: string | null;
          sort_order?: number | null;
          theme_id: string;
        };
        Update: {
          id?: string;
          ref_code?: string;
          theme_code?: string;
          name?: string;
          description?: string | null;
          sort_order?: number | null;
          theme_id?: string;
        };
      };
      indicators: {
        Row: {
          id: string; // uuid
          ref_code: string;
          level: string;
          name: string;
          description: string | null;
          sort_order: number | null;
          subtheme_id: string; // uuid (FK → subthemes.id)
          theme_id: string; // uuid (FK → themes.id)
        };
        Insert: {
          id?: string;
          ref_code: string;
          level: string;
          name: string;
          description?: string | null;
          sort_order?: number | null;
          subtheme_id: string;
          theme_id: string;
        };
        Update: {
          id?: string;
          ref_code?: string;
          level?: string;
          name?: string;
          description?: string | null;
          sort_order?: number | null;
          subtheme_id?: string;
          theme_id?: string;
        };
      };
      criteria_levels: {
        Row: {
          id: number; // int4
          label: string;
          default_score: number | null;
          sort_order: number | null;
          indicator_id: string; // uuid (FK → indicators.id)
        };
        Insert: {
          id?: number;
          label: string;
          default_score?: number | null;
          sort_order?: number | null;
          indicator_id: string;
        };
        Update: {
          id?: number;
          label?: string;
          default_score?: number | null;
          sort_order?: number | null;
          indicator_id?: string;
        };
      };
    };
  };
}
