// lib/types.ts

export type NestedPillar = {
  id: string;
  name: string;
  description?: string;
  refCode?: string;
  sortOrder?: number;
  type: "Pillar" | "Theme" | "Subtheme"; // required for rendering
  children?: NestedPillar[];
};
