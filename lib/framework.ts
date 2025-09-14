// lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/pillar";

export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = createClient();

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
            sort_order,
            theme_id,
            subtheme_id
          )
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("❌ Error fetching framework:", error);
    return [];
  }

  console.log("✅ Fetched framework:", data);
  return (data ?? []) as Pillar[];
}
