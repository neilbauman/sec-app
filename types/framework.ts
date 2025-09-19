export interface Subtheme {
  id: string;
  theme_id: string;
  name: string;
  description?: string;
  sort_order: number;
  ref_code?: string; // computed at runtime
}

export interface Theme {
  id: string;
  pillar_id: string;
  name: string;
  description?: string;
  sort_order: number;
  subthemes?: Subtheme[];
  ref_code?: string; // computed at runtime
}

export interface Pillar {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
  themes?: Theme[];
  ref_code?: string; // computed at runtime
}

export interface FrameworkTree {
  pillars: Pillar[];
}
