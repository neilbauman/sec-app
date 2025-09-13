// lib/framework.ts
import { createClient } from "@/lib/supabase-server";
export type { Pillar, Theme, Subtheme } from "@/types/framework";

/**
 * Fetch the full framework hierarchy from Supabase.
 */
export async function fetchFramework() {
  const supabase = await createClient(); // 👈 must await now

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

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
