// /types/framework.ts

export type Subtheme = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Theme = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  subthemes?: Subtheme[];
};

export type Pillar = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  themes?: Theme[];
};
