// /types/framework.ts
export type Pillar = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

export type Theme = {
  id: string;
  pillar_id: string; // FK to Pillar.id
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

export type Subtheme = {
  id: string;
  theme_id: string; // FK to Theme.id
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};
