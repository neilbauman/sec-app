// types/framework.ts

export interface Subtheme {
  id: number;
  theme_id: number;
  name: string;
  description: string;
  ref_code: string;  // was "code"
  sort_order: number;
}

export interface Theme {
  id: number;
  pillar_id: number;
  name: string;
  description: string;
  ref_code: string;  // was "code"
  sort_order: number;
  subthemes: Subtheme[];
}

export interface Pillar {
  id: number;
  name: string;
  description: string;
  ref_code: string;  // was "code"
  sort_order: number;
  themes: Theme[];
}
