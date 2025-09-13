// lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";

export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(`
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
          sort_order,
          indicators (
            id,
            name,
            description,
            ref_code,
            sort_order
          )
        )
      )
    `)
    .order("sort_order");

  if (error) {
    console.error("❌ Supabase error fetching framework:", error);
    throw error;
  }

  if (!data) {
    console.warn("⚠️ No framework data returned from Supabase");
    return [];
  }

  console.log("✅ Framework data loaded:", data);
  return data as Pillar[];
}
