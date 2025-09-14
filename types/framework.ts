// types/framework.ts

export interface Indicator {
  id: string;
  ref_code: string;
  subtheme_id: string | null;
  theme_id: string | null;
  name: string;
  description: string;
  sort_order: number;
}

export interface Subtheme {
  id: string;
  ref_code: string;
  theme_id: string;
  name: string;
  description: string;
  sort_order: number;
  indicators: Indicator[];
}

export interface Theme {
  id: string;
  ref_code: string;
  pillar_id: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
  indicators: Indicator[];
}

export interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
}

// ✅ Unify: FrameworkData = Pillar
export type FrameworkData = Pillar;
