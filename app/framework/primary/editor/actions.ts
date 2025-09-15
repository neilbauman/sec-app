// app/framework/primary/editor/actions.ts
"use server";

import { createClient } from "@/lib/supabase-server";
import { Pillar } from "@/types/framework";

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
      themes:themes (
        id,
        ref_code,
        pillar_code, -- ✅ use pillar_code instead of pillar_id
        name,
        description,
        sort_order,
        subthemes:subthemes (
          id,
          ref_code,
          theme_code, -- ✅ use theme_code instead of theme_id
          name,
          description,
          sort_order,
          indicators:indicators (
            id,
            ref_code,
            subtheme_id,
            theme_code,
            name,
            description,
            sort_order,
            criteria_levels:criteria_levels (
              id,
              indicator_id,
              level,
              description
            )
          )
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("❌ Supabase fetchFramework (editor) error:", error.message);
    return [];
  }

  return (data as Pillar[]) ?? [];
}
