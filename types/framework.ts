// /types/framework.ts

export interface Subtheme {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  theme_id: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  pillar_id: string;
  subthemes?: Subtheme[];
}

export interface Pillar {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  themes?: Theme[];
}

// ✅ Flexible type for the tree structure in the UI
export type FrameworkNode = Pillar | Theme | Subtheme;
