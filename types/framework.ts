// types/framework.ts
export type Pillar = {
  code: string;
  name: string;
  description?: string;
  // make sorting fields optional so either works
  sort?: number | string;
  sort_order?: number | string;
};

export type Theme = {
  code: string;
  name: string;
  description?: string;
  pillar_code?: string;   // preferred snake_case
  parent_code?: string;   // fallback if your data uses this
  sort?: number | string;
  sort_order?: number | string;
};

export type Subtheme = {
  code: string;
  name: string;
  description?: string;
  theme_code?: string;    // preferred snake_case
  parent_code?: string;   // fallback if your data uses this
  pillar_code?: string;   // sometimes present
  sort?: number | string;
  sort_order?: number | string;
};

export type FrameworkList = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};
