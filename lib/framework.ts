// lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/pillar";

export async function fetchFramework(): Promise<Pillar[]> {
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
    console.error("Supabase fetch error:", error);
    throw new Error(error.message);
  }

  console.log("Fetched pillars:", data);

  return (data ?? []) as Pillar[];
}
