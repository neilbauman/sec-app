// /types/framework.ts
export interface Subtheme {
  id: string;
  theme_id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
}

export interface Theme {
  id: string;
  pillar_id: string;
  ref_code: string;
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
