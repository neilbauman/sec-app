// /lib/framework.ts
import { supabase } from "@/lib/supabase-browser";
import type { Pillar } from "@/types/framework";

export async function getFramework(): Promise<Pillar[]> {
  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id,
      ref_code,
      name,
      description,
      sort_order,
      indicators (
        id,
        ref_code,
        name,
        description,
        sort_order,
        pillar_id,
        theme_id,
        subtheme_id
      ),
      themes (
        id,
        ref_code,
        pillar_id,
        pillar_code,
        name,
        description,
        sort_order,
        indicators (
          id,
          ref_code,
          name,
          description,
          sort_order,
          pillar_id,
          theme_id,
          subtheme_id
        ),
        subthemes (
          id,
          ref_code,
          theme_id,
          theme_code,
          name,
          description,
          sort_order,
          indicators (
            id,
            ref_code,
            name,
            description,
            sort_order,
            pillar_id,
            theme_id,
            subtheme_id
          )
        )
      )
    `)
    .order("sort_order");

  if (error) {
    console.error("Error fetching framework:", error);
    return [];
  }

  return data || [];
}
