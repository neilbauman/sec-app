// lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";

export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id,
      name,
      description,
      ref_code,
      sort_order,
      themes (
        id,
        name,
        description,
        ref_code,
        sort_order,
        subthemes (
          id,
          name,
          description,
          ref_code,
          sort_order,
          indicators (
            id,
            name,
            description,
            ref_code,
            sort_order
          )
        )
      )
    `)
    .order("sort_order", { ascending: true }) // top-level: pillars
    .order("sort_order", { foreignTable: "themes", ascending: true }) // nested: themes
    .order("sort_order", { foreignTable: "themes.subthemes", ascending: true }) // nested: subthemes
    .order("sort_order", { foreignTable: "themes.subthemes.indicators", ascending: true }); // nested: indicators

  if (error) throw error;
  return data as Pillar[];
}
