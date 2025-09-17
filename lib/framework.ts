// /lib/framework.ts
import { createClient } from "@/lib/supabase-client";
import { Pillar } from "@/types/framework";

export async function getFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id,
      ref_code,
      name,
      description,
      sort_order,
      themes:themes(
        id,
        ref_code,
        pillar_id,
        pillar_code,
        name,
        description,
        sort_order,
        subthemes:subthemes(
          id,
          ref_code,
          theme_id,
          theme_code,
          name,
          description,
          sort_order,
          indicators:indicators(
            id,
            ref_code,
            subtheme_id,
            theme_id,
            level,
            name,
            description,
            sort_order,
            criteria_levels:criteria_levels(
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

  return (data as Pillar[]) || [];
}
