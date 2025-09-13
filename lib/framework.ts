// lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework"; // 🔥 fixed import

export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(
      `
        id,
        name,
        description,
        ref_code,
        sort_order,
        themes (
          id,
          name,
          description,
          ref_code,
          sort_order,
          subthemes (
            id,
            name,
            description,
            ref_code,
            sort_order
          )
        )
      `
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching framework:", error);
    return [];
  }

  return data as Pillar[];
}
