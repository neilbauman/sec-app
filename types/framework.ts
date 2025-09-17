export interface Subtheme {
  id: string;
  name: string;
  description: string;
  sort_order: number;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
}

export interface Pillar {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
}
