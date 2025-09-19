export interface Pillar {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
}

export interface Theme {
  id: string;
  pillar_id: string;
  name: string;
  description?: string;
  sort_order: number;
}

export interface Subtheme {
  id: string;
  theme_id: string;
  name: string;
  description?: string;
  sort_order: number;
}
