// lib/framework.ts
import { supabase } from "@/lib/supabase-server";
import type { Pillar } from "@/types/pillar";

/**
 * Legacy-style fetcher if other parts of the app still use it.
 */
export async function getPillars(): Promise<Pillar[]> {
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
    console.error("❌ Error in getPillars:", error);
    return [];
  }

  return (data as Pillar[]) ?? [];
}
