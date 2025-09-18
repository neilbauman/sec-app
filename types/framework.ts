// /types/framework.ts

export type Subtheme = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
};

export type Theme = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes?: Subtheme[]; // ✅ add nested subthemes
};

export type Pillar = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  themes?: Theme[]; // ✅ add nested themes
};

// General tree node (union)
export type FrameworkNode = Pillar | Theme | Subtheme;
