// lib/framework.ts
import { createClient } from "@/lib/supabase-server"; // 👈 this line is missing

export async function fetchFramework() {
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
        pillar_code,
        pillar_id,
        name,
        description,
        sort_order,
        subthemes (
          id,
          ref_code,
          theme_code,
          theme_id,
          name,
          description,
          sort_order,
          indicators (
            id,
            ref_code,
            name,
            description,
            sort_order,
            level,
            subtheme_id,
            theme_id,
            criteria_levels (
              id,
              label,
              default_score,
              sort_order,
              indicator_id
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

  return data;
}
