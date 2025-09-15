// types/framework.ts

export interface Indicator {
  id: string;
  ref_code: string;
  subtheme_id: string;
  theme_code: string;
  name: string;
  description: string;
  sort_order: number;
  criteria_levels: CriteriaLevel[];
}

export interface CriteriaLevel {
  id: string;
  indicator_id: string;
  level: number;
  description: string;
}

export interface Subtheme {
  id: string;
  ref_code: string;
  theme_code: string;
  name: string;
  description: string;
  sort_order: number;
  indicators: Indicator[];
}

export interface Theme {
  id: string;
  ref_code: string;
  pillar_code: string; // ✅ matches Supabase
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
}

export interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
}
