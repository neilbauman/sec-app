// lib/types.ts

export type NestedSubtheme = {
  id: string;
  name: string;
  description?: string;
  refCode?: string;
  sortOrder?: number;
  type: "Subtheme";
};

export type NestedTheme = {
  id: string;
  name: string;
  description?: string;
  refCode?: string;
  sortOrder?: number;
  type: "Theme";
  children?: NestedSubtheme[];
};

export type NestedPillar = {
  id: string;
  name: string;
  description?: string;
  refCode?: string;
  sortOrder?: number;
  type: "Pillar";
  children?: NestedTheme[];
};
