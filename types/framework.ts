// types/framework.ts

export interface Subtheme {
  id: string;
  name: string;
  description?: string;
  ref_code: string; // human readable reference code
  sort_order?: number;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  ref_code: string;
  sort_order?: number;
  subthemes?: Subtheme[];
}

export interface Pillar {
  id: string;
  name: string;
  description?: string;
  ref_code: string;
  sort_order?: number;
  themes?: Theme[];
}
