import { createClient } from "@/lib/supabase-server";

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
        name,
        description,
        sort_order,
        subthemes (
          id,
          ref_code,
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
            level,
            criteria_levels (*)
          )
        )
      )
    `);

  if (error) {
    console.error("Error fetching pillars:", error);
    return [];
  }

  return data ?? [];
}
