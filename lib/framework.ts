// /lib/framework.ts
import { supabaseServer } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";

export async function getPrimaryFramework(): Promise<Pillar[]> {
  const supabase = supabaseServer();

  // Pull pillars with nested themes and subthemes, all ordered by sort_order
  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id,
      name,
      description,
      sort_order,
      themes:themes (
        id,
        pillar_id,
        name,
        description,
        sort_order,
        subthemes:subthemes (
          id,
          theme_id,
          name,
          description,
          sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true })
    .order("sort_order", { foreignTable: "themes", ascending: true })
    .order("sort_order", { foreignTable: "themes.subthemes", ascending: true });

  if (error) {
    console.error("[getPrimaryFramework]", error);
    return [];
  }

  // PostgREST returns null when there are no children; coerce to arrays.
  return (data ?? []).map((p) => ({
    ...p,
    themes: (p.themes ?? []).map((t: any) => ({
      ...t,
      subthemes: t.subthemes ?? [],
    })),
  }));
}
