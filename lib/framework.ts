// lib/framework.ts

import { createClient } from "@/lib/supabase-server"; // ✅ fixed import
export type { Pillar, Theme, Subtheme } from "@/types/framework";

/**
 * Get pillars with their themes and subthemes from Supabase.
 */
export async function getFrameworkData() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(
      `
        id,
        name,
        description,
        code,
        sort_order,
        themes (
          id,
          name,
          description,
          subthemes (
            id,
            name,
            description
          )
        )
      `
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching framework data:", error.message);
    throw new Error(error.message);
  }

  return data;
}
