// types/framework.ts

export interface Indicator {
  id: string;
  ref_code: string;
  subtheme_id: string;
  subtheme_code: string;
  name: string;
  description: string;
  sort_order: number;
}

export interface Subtheme {
  id: string;
  ref_code: string;
  theme_id: string;
  theme_code: string;
  name: string;
  description: string;
  sort_order: number;
  indicators?: Indicator[];
}

export interface Theme {
  id: string;
  ref_code: string;
  pillar_id: string;
  pillar_code: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes?: Subtheme[];
  indicators?: Indicator[]; // themes can also have indicators
}

export interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes?: Theme[];
}

/**
 * Used for flexible passing of nested data in components like
 * `PrimaryFrameworkEditorClient` and `PrimaryFrameworkCards`.
 */
export type FrameworkData = Pillar;
