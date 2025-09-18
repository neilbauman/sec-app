// /types/framework.ts

// Pillar type
export type Pillar = {
  id: number;
  ref_code: string | null;
  name: string;
  description?: string;
  sort_order: number;
  themes: Theme[];
};

// Theme type
export type Theme = {
  id: number;
  ref_code: string | null;
  name: string;
  description?: string;
  sort_order: number;
  subthemes: Subtheme[];
};

// Subtheme type
export type Subtheme = {
  id: number;
  ref_code: string | null;
  name: string;
  description?: string;
  sort_order: number;
  indicators?: Indicator[];
};

// Indicator type
export type Indicator = {
  id: number;
  ref_code: string | null;
  name: string;
  description?: string;
  sort_order: number;
};
