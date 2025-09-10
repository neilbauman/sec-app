// types/framework.ts
export type Pillar = {
  code: string;
  name: string;
  description?: string | null;
};

export type Theme = {
  code: string;
  name: string;
  description?: string | null;
  pillar_code: string; // parent
};

export type Subtheme = {
  code: string;
  name: string;
  description?: string | null;
  pillar_code: string; // grandparent
  theme_code: string;  // parent
};
