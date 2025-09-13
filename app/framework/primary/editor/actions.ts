// app/framework/primary/editor/actions.ts
"use server";

import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types";

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
      themes:themes!fk_themes_pillar (
        id,
        ref_code,
        name,
        description,
        sort_order
      )
    `);

  if (error) {
    console.error("❌ Error fetching framework:", error);
    return [];
  }

  console.log("✅ Fetched framework:", data);
  return data ?? [];
}
