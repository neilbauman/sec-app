// lib/framework.ts
import { createClient } from "./supabase-server";

/**
 * Example server-side query for fetching the framework pillars.
 * Adjust the select() to match your needs.
 */
export async function getFramework() {
  const supabase = await createClient();

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
        subthemes (
          id,
          ref_code,
          name,
          description,
          sort_order,
          indicators (
            id,
            ref_code,
            name,
            description,
            level,
            sort_order
          )
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
