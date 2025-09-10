// types/framework.ts
export type Pillar = {
  id: string;                // uuid, required
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

export type Theme = {
  id: string;                // uuid, required
  code: string;
  pillar_id?: string | null; // uuid fk (new schema), optional for now
  pillar_code?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

export type Subtheme = {
  id: string;                // uuid, required
  code: string;
  theme_id?: string | null;  // uuid fk (new schema), optional for now
  theme_code?: string | null;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

export type FrameworkList = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};
