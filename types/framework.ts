// /types/framework.ts

export type Pillar = {
  code: string;
  name: string | null;
  description: string | null;
  sort_order: number | null; // <- matches your schema
};

export type Theme = {
  code: string;
  pillar_code: string;
  name: string | null;
  description: string | null;
  sort_order: number | null; // <- matches your schema
};

export type Subtheme = {
  code: string;
  theme_code: string;
  name: string | null;
  description: string | null;
  sort_order: number | null; // <- matches your schema
};

export type FrameworkList = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};
