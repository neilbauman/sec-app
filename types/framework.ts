// types/framework.ts
export type Subtheme = {
  id: string;
  name: string;
  description?: string;
  code?: string;
  sort_order?: number;
  theme_id?: string;   // 👈 make optional
};

export type Theme = {
  id: string;
  name: string;
  description?: string;
  code?: string;
  sort_order?: number;
  pillar_id?: string;  // 👈 make optional
  subthemes: Subtheme[];
};

export type Pillar = {
  id: string;
  name: string;
  description?: string;
  code?: string;
  sort_order?: number;
  themes: Theme[];
};
