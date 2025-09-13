// lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types";

export async function getFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id,
      name,
      description,
      ref_code,
      sort_order,
      themes (
        id,
        pillar_id,
        name,
        description,
        ref_code,
        sort_order,
        subthemes (
          id,
          theme_id,
          name,
          description,
          ref_code,
          sort_order
        )
      )
    `)
    .order("sort_order");

  if (error) {
    console.error("Error fetching framework:", error);
    return [];
  }

  return data ?? [];
}
