// /types/framework.ts

export interface CriteriaLevel {
  id: number; // int4
  indicator_id: string; // uuid FK
  label: string;
  default_score: number;
  sort_order: number;
}

export interface Indicator {
  id: string; // uuid PK
  subtheme_id: string; // uuid FK
  theme_id: string; // uuid FK (optional in schema, but included for joins)
  ref_code: string;
  level: string;
  name: string;
  description: string;
  sort_order: number;
  criteria_levels: CriteriaLevel[];
}

export interface Subtheme {
  id: string; // uuid PK
  theme_id: string; // uuid FK
  ref_code: string;
  theme_code: string;
  name: string;
  description: string;
  sort_order: number;
  indicators: Indicator[];
}

export interface Theme {
  id: string; // uuid PK
  pillar_id: string; // uuid FK
  ref_code: string;
  pillar_code: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
}

export interface Pillar {
  id: string; // uuid PK
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
}
