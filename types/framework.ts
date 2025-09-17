// /types/framework.ts (add only the ? fields shown)
export interface Subtheme {
  id: string;
  theme_id: string;
  ref_code: string;
  theme_code: string;
  name: string;
  description: string;
  sort_order: number;
  indicators: Indicator[];
  default_indicator_id?: string;   // <— add
}

export interface Theme {
  id: string;
  pillar_id: string;
  ref_code: string;
  pillar_code: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
  default_indicator_id?: string;   // <— add
}

export interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
  default_indicator_id?: string;   // <— add
}
