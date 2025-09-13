"use server";

import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types";

export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  console.log("🚀 Running fetchFramework...");

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
            sort_order
          )
        ),
        indicators (
          id,
          ref_code,
          name,
          description,
          sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("❌ Supabase fetch error:", error);
    return [];
  }

  console.log("✅ Supabase fetch success. Rows returned:", data?.length ?? 0);
  console.dir(data, { depth: null });

  return (data ?? []) as Pillar[];
}
