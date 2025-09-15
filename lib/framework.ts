// lib/framework.ts
import { createClient } from "@/lib/supabase-server";

// Fetch framework data: pillars and their themes
export async function fetchFramework() {
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
        pillar_code,
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

  console.log("Pillars with themes:", data);
  return data ?? [];
}
