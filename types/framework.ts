// types/framework.ts

export interface Indicator {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  subtheme_id: string;   // FK
  subtheme_code?: string;
}

export interface Subtheme {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  theme_id: string;   // FK
  theme_code?: string;
  indicators?: Indicator[];
}

export interface Theme {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  pillar_id: string;   // FK
  pillar_code?: string;
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
