// /types/framework.ts

export interface Subtheme {
  id: string;
  ref_code: string;
  theme_code: string;
  name: string;
  description: string | null;
  sort_order: number;
  theme_id: string;
}

export interface Theme {
  id: string;
  ref_code: string;
  pillar_code: string;
  name: string;
  description: string | null;
  sort_order: number;
  pillar_id: string;
  subthemes?: Subtheme[];
}

export interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;
  themes?: Theme[];
}
