// lib/framework-client.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import { recalcRefCodes } from "@/lib/framework-utils";

/**
 * Core nested types used by the UI. `ref_code` is computed (optional).
 */
export type NestedSubtheme = {
  id: string;
  theme_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  ref_code?: string;
};

export type NestedTheme = {
  id: string;
  pillar_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  subthemes: NestedSubtheme[];
  ref_code?: string;
};

export type NestedPillar = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  themes: NestedTheme[];
  ref_code?: string;
};

/**
 * Fetch pillars → themes → subthemes, order each level by sort_order,
 * then compute ref codes (P#, T#.#, ST#.#.#) for display.
 */
export async function fetchFramework(): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id, name, description, sort_order,
      themes:themes (
        id, pillar_id, name, description, sort_order,
        subthemes:subthemes (
          id, theme_id, name, description, sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const pillars: NestedPillar[] = (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    sort_order: p.sort_order,
    themes: (p.themes ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((t: any) => ({
        id: t.id,
        pillar_id: t.pillar_id,
        name: t.name,
        description: t.description,
        sort_order: t.sort_order,
        subthemes: (t.subthemes ?? [])
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((s: any) => ({
            id: s.id,
            theme_id: s.theme_id,
            name: s.name,
            description: s.description,
            sort_order: s.sort_order,
          })),
      })),
  }));

  return recalcRefCodes(pillars);
}
