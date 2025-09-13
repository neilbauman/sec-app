// lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";

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
        sort_order
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching framework:", error);
    return [];
  }

  console.log("Fetched pillars with themes:", data);
  return data as Pillar[];
}
