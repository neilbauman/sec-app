// types/framework.ts

export interface Theme {
  id: string;
  ref_code: string;
  pillar_id: string;
  name: string;
  description: string;
  sort_order: number;
}

export interface Pillar {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
}
