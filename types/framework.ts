export interface Indicator {
  id: string;
  name: string;
  description: string;
  ref_code: string;
  sort_order: number;   // ✅ add
}

export interface Subtheme {
  id: string;
  name: string;
  description: string;
  ref_code: string;
  sort_order: number;   // ✅ add
  indicators?: Indicator[];
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  ref_code: string;
  sort_order: number;   // ✅ add
  subthemes?: Subtheme[];
}

export interface Pillar {
  id: string;
  name: string;
  description: string;
  ref_code: string;
  sort_order: number;   // ✅ add
  themes?: Theme[];
}
