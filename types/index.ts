// types/index.ts

// ✅ CriteriaLevel represents a reusable scale/level attached to Indicators
export interface CriteriaLevel {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
}

// ✅ Indicator: lowest-level measurement, linked to Theme or Subtheme
export interface Indicator {
  id: string;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;

  // FK links
  theme_id: string | null;     // if indicator is linked directly to a Theme
  subtheme_id: string | null;  // if indicator is linked to a Subtheme

  // Optional relationships
  criteria_levels?: CriteriaLevel[];
}

// ✅ Subtheme: nested under Theme
export interface Subtheme {
  id: string;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;
  theme_id: string; // FK to Theme

  // Nested indicators
  indicators?: Indicator[];
}

// ✅ Theme: belongs to a Pillar, may contain Subthemes OR Indicators
export interface Theme {
  id: string;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;
  pillar_id: string; // FK to Pillar

  // Nested relations
  subthemes?: Subtheme[];
  indicators?: Indicator[];
}

// ✅ Pillar: top-level grouping
export interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;

  // Nested relations
  themes: Theme[];
}
