// /lib/framework.ts
import { createClient } from "./supabase-server";

export async function getFramework() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id,
      ref_code,
      name,
      description,
      sort_order,
      themes:themes!themes_pillar_id_fkey (
        id,
        ref_code,
        name,
        description,
        sort_order,
        subthemes:subthemes!subthemes_theme_id_fkey (
          id,
          ref_code,
          name,
          description,
          sort_order,
          indicators:indicators!indicators_subtheme_id_fkey (
            id,
            ref_code,
            name,
            description,
            sort_order,
            criteria_levels:criteria_levels!criteria_levels_indicator_id_fkey (
              id,
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
    console.error("Error fetching pillars:", error);
    throw new Error(`Error fetching pillars: ${error.message}`);
  }

  return data || [];
}
