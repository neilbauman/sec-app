// lib/framework-client.ts
import { supabase } from "./supabase-client";

export async function fetchFramework(): Promise<any[]> {
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
        pillar_id,
        pillar_code,
        name,
        description,
        sort_order,
        subthemes (
          id,
          ref_code,
          theme_id,
          theme_code,
          name,
          description,
          sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Supabase fetchFramework error:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}
