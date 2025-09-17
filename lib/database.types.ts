// lib/database.types.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      pillars: {
        Row: {
          id: string;
          ref_code: string;
          name: string;
          description: string | null;
          sort_order: number;
        };
      };
      themes: {
        Row: {
          id: string;
          ref_code: string;
          pillar_id: string;
          name: string;
          description: string | null;
          sort_order: number;
        };
      };
      subthemes: {
        Row: {
          id: string;
          ref_code: string;
          theme_id: string;
          name: string;
          description: string | null;
          sort_order: number;
        };
      };
      indicators: {
        Row: {
          id: string;
          ref_code: string;
          subtheme_id: string;
          theme_id: string;
          name: string;
          description: string | null;
          sort_order: number;
        };
      };
      criteria_levels: {
        Row: {
          id: number;
          indicator_id: string;
          label: string;
          default_score: number;
          sort_order: number;
        };
      };
    };
  };
}
