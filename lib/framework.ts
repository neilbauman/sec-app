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
      themes (
        id,
        ref_code,
        name,
        description,
        sort_order,
        subthemes (
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
            criteria_levels (
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
