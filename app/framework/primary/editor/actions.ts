// app/framework/primary/editor/actions.ts
"use server";

import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";

export async function fetchPillar(id: string): Promise<Pillar> {
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
          pillar_id,
          name,
          description,
          ref_code,
          sort_order,
          subthemes (
            id,
            theme_id,
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

export async function fetchAllPillars(): Promise<Pillar[]> {
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
          pillar_id,
          name,
          description,
          ref_code,
          sort_order,
          subthemes (
            id,
            theme_id,
            name,
            description,
            ref_code,
            sort_order
          )
        )
      `
    )
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data as Pillar[];
}
