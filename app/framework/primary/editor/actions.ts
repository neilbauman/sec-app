// app/framework/primary/editor/actions.ts

"use server";

import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types";

/**
 * Fetch the full framework hierarchy:
 * Pillars → Themes → Subthemes → Indicators
 */
export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(
      `
      id,
      ref_code,
      name,
      description,
      sort_order,
      themes!inner (
        id,
        ref_code,
        name,
        description,
        sort_order,
        pillar_id,  -- ✅ include FK
        subthemes (
          id,
          ref_code,
          name,
          description,
          sort_order,
          theme_id,  -- ✅ include FK
          indicators (
            id,
            ref_code,
            name,
            description,
            sort_order,
            subtheme_id  -- ✅ include FK
          )
        ),
        indicators (
          id,
          ref_code,
          name,
          description,
          sort_order,
          theme_id  -- ✅ include FK
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
  return data ?? [];
}
