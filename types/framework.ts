// types/framework.ts

export interface Indicator {
  id: string;
  name: string;
}

export interface Subtheme {
  id: string;
  name: string;
  indicators?: Indicator[];
}

export interface Theme {
  id: string;
  name: string;
  subthemes?: Subtheme[];
  indicators?: Indicator[]; // for themes without subthemes
}

export interface Pillar {
  id: string;
  name: string;
  themes: Theme[];
}
