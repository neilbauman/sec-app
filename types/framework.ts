// Canonical types for the framework data model

export type Pillar = {
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Theme = {
  code: string;
  pillar_code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Subtheme = {
  code: string;
  theme_code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type FrameworkList = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  // optional convenience counts (safe to include or omit)
  counts?: {
    pillars: number;
    themes: number;
    subthemes: number;
  };
};
