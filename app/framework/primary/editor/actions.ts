// app/framework/primary/editor/actions.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";

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
        name,
        description,
        sort_order,
        pillar_id,
        subthemes (
          id,
          ref_code,
          name,
          description,
          sort_order,
          theme_id,
          indicators (
            id,
            ref_code,
            name,
            description,
            sort_order,
            subtheme_id
          )
        )
      )
    `)
    .order("sort_order");

  if (error) {
    console.error("❌ Error fetching framework:", error);
    return [];
  }

  return data ?? [];
}
