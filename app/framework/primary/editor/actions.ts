// app/framework/primary/editor/actions.ts
"use server";

import { supabase } from "@/lib/supabase-server";
import type { Pillar } from "@/types/pillar";

/**
 * Fetch the full framework hierarchy:
 * Pillars -> Themes -> Subthemes -> Indicators
 */
export async function fetchFramework(): Promise<Pillar[]> {
  const { data, error } = await supabase
    .from("pillars")
    .select(
      `
      id,
      ref_code,
      name,
      description,
      sort_order,
      themes!fk_themes_pillar (
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
        ),
        indicators (
          id,
          ref_code,
          name,
          description,
          sort_order,
          theme_id
        )
      )
    `
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("❌ Error fetching framework:", error);
    throw new Error(error.message);
  }

  console.log("✅ Fetched framework:", data);
  return (data as Pillar[]) ?? [];
}
