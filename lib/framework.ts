// lib/framework.ts
import { createClient } from "@/utils/supabase/server";
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
      themes:themes!themes_pillar_id_fkey (
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
            theme_id,
            subtheme_id
          )
        ),
        indicators (
          id,
          ref_code,
          name,
          description,
          sort_order,
          theme_id,
          subtheme_id
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("❌ Error fetching framework:", error);
    return [];
  }

  return (data ?? []) as Pillar[];
}
