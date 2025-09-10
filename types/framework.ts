export type Pillar = {
  id: string;
  code: string;
  name: string;
  description: string;
  sort_order: number;
};

export type Theme = {
  id: string;
  pillar_id: string;
  code: string;
  name: string;
  description: string;
  sort_order: number;
};

export type Subtheme = {
  id: string;
  theme_id: string;
  code: string;
  name: string;
  description: string;
  sort_order: number;
};
