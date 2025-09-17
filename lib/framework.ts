// /lib/framework.ts
import { createClient } from "@/utils/supabase/server";
import { Pillar } from "@/types/framework";

export async function getFrameworkWithThemes(): Promise<Pillar[]> {
  const supabase = createClient();

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
        name,
        description,
        sort_order,
        pillar_id,
        pillar_code,
        subthemes (
          id,
          ref_code,
          name,
          description,
          sort_order,
          theme_id,
          theme_code,
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
    .order("sort_order");

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  return (data as unknown as Pillar[]) || [];
}
