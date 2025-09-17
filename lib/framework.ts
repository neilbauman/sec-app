// /lib/framework.ts
import { supabase } from "@/lib/supabase-browser";
import type { Pillar } from "@/types/framework";

/**
 * Fetches the full SSC framework hierarchy (pillars, themes, subthemes).
 * This is used by the Primary Framework Editor.
 */
export async function getFramework(): Promise<Pillar[]> {
  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id,
      ref_code,
      name,
      description,
      sort_order,
      themes (
        id,
        ref_code,
        pillar_id,
        pillar_code,
        name,
        description,
        sort_order,
        subthemes (
          id,
          ref_code,
          theme_id,
          theme_code,
          name,
          description,
          sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching framework:", error);
    return [];
  }

  return data || [];
}
