// app/framework/primary/editor/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";
import { Pillar } from "@/types/framework";

/**
 * Fetch the full framework hierarchy:
 * Pillars → Themes → Subthemes → Indicators
 */
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
      themes:themes!fk_themes_pillar (
        id,
        ref_code,
        name,
        description,
        sort_order,
        pillar_id,
        subthemes:subthemes!fk_subthemes_theme (
          id,
          ref_code,
          name,
          description,
          sort_order,
          theme_id,
          indicators:indicators!fk_indicators_subtheme (
            id,
            ref_code,
            name,
            description,
            sort_order,
            subtheme_id
          )
        ),
        indicators:indicators!fk_indicators_theme (
          id,
          ref_code,
          name,
          description,
          sort_order,
          theme_id
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("❌ Error fetching framework:", error);
    return [];
  }

  console.log("✅ Framework fetched:", data);
  return (data ?? []) as Pillar[];
}
