"use client";

import { supabase } from "@/lib/supabase-browser";
import type { Pillar } from "@/types/framework";

export async function getFrameworkClient(): Promise<Pillar[]> {
  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id, ref_code, name, description, sort_order,
      themes:themes (
        id, ref_code, pillar_id, pillar_code, name, description, sort_order,
        subthemes:subthemes (
          id, ref_code, theme_id, theme_code, name, description, sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, foreignTable: "themes" })
    .order("sort_order", { ascending: true, foreignTable: "themes.subthemes" });

  if (error) throw error;
  return (data ?? []) as unknown as Pillar[];
}
