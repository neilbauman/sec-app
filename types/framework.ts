// types/framework.ts

export interface CriteriaLevel {
  id: string;
  indicator_id: string;
  label: string;
  default_score: number;
  sort_order: number;
}

export interface Indicator {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  subtheme_id: string;
  level: string;
  criteria_levels?: CriteriaLevel[];
}

export interface Subtheme {
  id: string;
  ref_code: string;
  theme_code: string;
  name: string;
  description: string;
  sort_order: number;
  theme_id: string;
  indicators?: Indicator[];
}

export interface Theme {
  id: string;
  ref_code: string;
  pillar_code: string;
  name: string;
  description: string;
  sort_order: number;
  pillar_id: string;
  subthemes?: Subtheme[];
}

export interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes?: Theme[];
}
