// types/framework.ts
export type Pillar = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order: number;
};

export type Theme = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order: number;
  pillar_id: string | null;
};

export type Subtheme = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order: number;
  theme_id: string | null;
};
