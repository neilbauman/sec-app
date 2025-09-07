export type Pillar = { id: string; code: string; name: string; description?: string; sort_order?: number; };
export type Theme = { id: string; code: string; name: string; description?: string; sort_order?: number; pillar_id: string; };
export type Subtheme = { id: string; code: string; name: string; description?: string; sort_order?: number; theme_id: string; };
