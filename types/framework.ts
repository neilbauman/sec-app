export interface Subtheme {
  id: string;
  ref_code: string;
  theme_id: string;
  theme_code: string;
  name: string;
  description: string;
  sort_order: number;
  indicators?: Indicator[];   // ✅ optional
  default_indicator_id?: string | null;
}

export interface Theme {
  id: string;
  ref_code: string;
  pillar_id: string;
  pillar_code: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
  indicators?: Indicator[];   // ✅ optional
  default_indicator_id?: string | null;
}

export interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
  indicators?: Indicator[];   // ✅ optional
  default_indicator_id?: string | null;
}
