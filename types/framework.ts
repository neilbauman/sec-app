// /types/framework.ts

export type Pillar = {
  code: string;
  name: string;
  description?: string | null;
  order_index?: number | null;
};

export type Theme = {
  code: string;
  pillar_code: string;   // <— required
  name: string;
  description?: string | null;
  order_index?: number | null;
};

export type Subtheme = {
  code: string;
  theme_code: string;    // <— required
  pillar_code: string;   // <— required (we’ll derive if DB doesn’t store it)
  name: string;
  description?: string | null;
  order_index?: number | null;
};

export type FrameworkList = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};
