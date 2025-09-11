// types/framework.ts

/**
 * Subtheme entity
 */
export type Subtheme = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  theme_id: string;
  sort_order: number;
};

/**
 * Theme entity with nested subthemes
 */
export type Theme = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  pillar_id: string;
  sort_order: number;
  pillar_code?: string; // optional if you sometimes use pillar_code instead of pillar_id
  subthemes: Subtheme[];
};

/**
 * Pillar entity with nested themes
 */
export type Pillar = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  themes: Theme[];
};
