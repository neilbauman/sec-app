// /types/framework.ts

export type Subtheme = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  theme_id: string; // FK → themes.id
};

export type Theme = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  pillar_id: string; // FK → pillars.id
  subthemes?: Subtheme[];
};

export type Pillar = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  themes?: Theme[];
};
