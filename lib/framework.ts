// /lib/framework.ts
import { supabase } from "@/lib/supabase-browser";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export async function getFramework(): Promise<Pillar[]> {
  // Pull pillars with nested themes and subthemes. Order by sort_order at each level.
  const query = supabase
    .from("pillars")
    .select(`
      id, ref_code, name, description, sort_order, default_indicator_id,
      themes:themes (
        id, ref_code, name, description, sort_order, pillar_id, pillar_code, default_indicator_id,
        subthemes:subthemes (
          id, ref_code, name, description, sort_order, theme_id, theme_code, default_indicator_id
        )
      )
    `)
    .order("sort_order", { ascending: true }) // pillars
    .order("sort_order", { foreignTable: "themes", ascending: true }) // themes
    .order("sort_order", { foreignTable: "themes.subthemes", ascending: true }); // subthemes

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching framework:", error.message);
    return [];
  }

  // PostgREST returns nested arrays under aliases; coerce to your TS shapes safely.
  const pillars: Pillar[] = (data || []).map((p: any) => ({
    id: p.id,
    ref_code: p.ref_code,
    name: p.name,
    description: p.description,
    sort_order: p.sort_order,
    default_indicator_id: p.default_indicator_id ?? undefined,
    themes: (p.themes || []).map((t: any): Theme => ({
      id: t.id,
      pillar_id: t.pillar_id,
      pillar_code: t.pillar_code,
      ref_code: t.ref_code,
      name: t.name,
      description: t.description,
      sort_order: t.sort_order,
      default_indicator_id: t.default_indicator_id ?? undefined,
      subthemes: (t.subthemes || []).map((s: any): Subtheme => ({
        id: s.id,
        theme_id: s.theme_id,
        theme_code: s.theme_code,
        ref_code: s.ref_code,
        name: s.name,
        description: s.description,
        sort_order: s.sort_order,
        default_indicator_id: s.default_indicator_id ?? undefined,
        indicators: [] // not needed in Primary editor; leave empty for now
      })),
    })),
  }));

  return pillars;
}
