"use server";

import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";

export async function getPillarById(id: string): Promise<Pillar> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(
      `
        id,
        name,
        description,
        ref_code,
        sort_order,
        themes (
          id,
          name,
          description,
          ref_code,
          sort_order,
          subthemes (
            id,
            name,
            description,
            ref_code,
            sort_order
          )
        )
      `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Pillar;
}
