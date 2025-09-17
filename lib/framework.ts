// /lib/framework.ts
import { supabaseServer } from "@/lib/supabase-server";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export async function getFramework(): Promise<Pillar[]> {
  const { data, error } = await supabaseServer
    .from("pillars")
    .select(`
      id, name, description, sort_order,
      themes (
        id, name, description, sort_order, pillar_id,
        subthemes (
          id, name, description, sort_order, theme_id
        )
      )
    `)
    .order("sort_order");

  if (error) throw error;
  return data || [];
}
