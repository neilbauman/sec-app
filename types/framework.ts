// types/framework.ts

export interface Indicator {
  id: string;
  ref_code: string;
  name: string;
  description?: string | null;
  sort_order: number;
  subtheme_id?: string | null; // belongs to subtheme OR null
  theme_id?: string | null;    // if directly linked to theme
}

export interface Subtheme {
  id: string;
  ref_code: string;
  name: string;
  description?: string | null;
  sort_order: number;
  theme_id: string;
  indicators: Indicator[];
}

export interface Theme {
  id: string;
  ref_code: string;
  name: string;
  description?: string | null;
  sort_order: number;
  pillar_id: string;
  subthemes: Subtheme[];
  indicators: Indicator[]; // indicators can attach directly to a theme
}

export interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description?: string | null;
  sort_order: number;
  themes: Theme[];
}
