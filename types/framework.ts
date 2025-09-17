// /types/framework.ts

export interface Indicator {
  id: string;             // uuid PK
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;

  // Foreign keys
  pillar_id?: string;     // uuid FK (nullable — only if linked to a pillar)
  theme_id?: string;      // uuid FK (nullable — only if linked to a theme)
  subtheme_id?: string;   // uuid FK (nullable — only if linked to a subtheme)
}

export interface Subtheme {
  id: string;             // uuid PK
  theme_id: string;       // uuid FK
  ref_code: string;
  theme_code: string;
  name: string;
  description: string;
  sort_order: number;

  // Relationships
  indicators: Indicator[];
}

export interface Theme {
  id: string;             // uuid PK
  pillar_id: string;      // uuid FK
  ref_code: string;
  pillar_code: string;
  name: string;
  description: string;
  sort_order: number;

  // Relationships
  subthemes: Subtheme[];
  indicators: Indicator[];
}

export interface Pillar {
  id: string;             // uuid PK
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;

  // Relationships
  themes: Theme[];
  indicators: Indicator[];
}
