// types/framework.ts

export interface Indicator {
  id: string;
  ref_code: string;
  name: string;
  description?: string;
  sort_order?: number;
  theme_id?: string | null;
  subtheme_id?: string | null;
}

export interface Subtheme {
  id: string;
  ref_code: string;
  name: string;
  description?: string;
  sort_order?: number;
  theme_id: string;
  indicators?: Indicator[];
}

export interface Theme {
  id: string;
  ref_code: string;
  name: string;
  description?: string;
  sort_order?: number;
  pillar_id: string;
  subthemes?: Subtheme[];
  indicators?: Indicator[];
}

export interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description?: string;
  sort_order?: number;
  themes?: Theme[];
}
