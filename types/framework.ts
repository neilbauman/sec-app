// types/framework.ts

export interface Indicator {
  id: string;
  name: string;
  subtheme_id?: string | null;
  theme_id?: string | null;
}

export interface Subtheme {
  id: string;
  name: string;
  theme_id: string;
  indicators?: Indicator[];
}

export interface Theme {
  id: string;
  name: string;
  pillar_id: string;
  subthemes?: Subtheme[];
  indicators?: Indicator[]; // supports themes with direct indicators
}

export interface Pillar {
  id: string;
  name: string;
  themes: Theme[];
}

// Root type for the whole framework hierarchy
export interface FrameworkData {
  pillars: Pillar[];
}
