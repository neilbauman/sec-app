// /types/framework.ts
export interface Subtheme {
  id: string;
  code: string;
  name: string;
  description?: string;
  sort_order: number;
}

export interface Theme {
  id: string;
  code: string;
  name: string;
  description?: string;
  sort_order: number;
  subthemes?: Subtheme[];
}

export interface Pillar {
  id: string;
  code: string;
  name: string;
  description?: string;
  sort_order: number;
  themes?: Theme[];
}
