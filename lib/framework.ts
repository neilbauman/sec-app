// lib/framework.ts
import { createClient } from "@/lib/supabase-server";
export type { Pillar, Theme, Subtheme } from "@/types/framework";

/**
 * Fetch the full framework hierarchy:
 * - Pillars
 * - Themes
 * - Subthemes
 */
export async function fetchFramework() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id,
      name,
      description,
      code,
      sort_order,
      themes (
        id,
        pillar_id,
        name,
        description,
        code,
        sort_order,
        subthemes (
          id,
          theme_id,
          name,
          description,
          code,
          sort_order
        )
      )
    `)
    .order("sort_order");

  if (error) throw error;
  return data;
}
