// /lib/framework.ts
import { createServerClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";

export async function getFramework(): Promise<Pillar[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id, name, description, sort_order,
      themes (
        id, name, description, sort_order,
        subthemes (
          id, name, description, sort_order
        )
      )
    `)
    .order("sort_order");

  if (error) {
    console.error("Error fetching framework:", error.message);
    return [];
  }

  return data || [];
}
