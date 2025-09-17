// /lib/framework.ts
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Pillar } from "@/types/framework";

export async function getFramework(): Promise<Pillar[]> {
  const { data, error } = await supabaseBrowser
    .from("pillars")
    .select(`
      id,
      ref_code,
      name,
      description,
      sort_order,
      themes (
        id,
        pillar_id,
        pillar_code,
        ref_code,
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
          sort_order,
          indicators (
            id,
            subtheme_id,
            theme_id,
            ref_code,
            level,
            name,
            description,
            sort_order,
            criteria_levels (
              id,
              indicator_id,
              label,
              default_score,
              sort_order
            )
          )
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
