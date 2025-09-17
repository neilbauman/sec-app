import { createClient } from "@/utils/supabase/server";
import { Pillar } from "@/lib/types";

export async function getFrameworkWithThemes(): Promise<Pillar[]> {
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
        pillar_code,
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
    console.error("Supabase error:", error);
    return [];
  }

  // Cast explicitly to your types
  return (data as unknown as Pillar[]) || [];
}
