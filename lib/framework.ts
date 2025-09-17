import { createClient } from "@/utils/supabase/client";
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
        sort_order,
        subthemes (
          id,
          ref_code,
          name,
          description,
          sort_order
        )
      )
    `)
    .order("sort_order");

  if (error) {
    console.error("Error fetching framework:", error);
    throw new Error(error.message);
  }

  return data || [];
}
