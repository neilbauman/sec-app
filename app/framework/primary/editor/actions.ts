"use server";

import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";

/**
 * Fetch the entire framework hierarchy (pillars → themes → subthemes → indicators).
 */
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
        pillar_id,   -- ✅ ensure pillar_id is included
        subthemes (
          id,
          ref_code,
          name,
          description,
          sort_order,
          theme_id,  -- ✅ ensure theme_id is included
          indicators (
            id,
            ref_code,
            name,
            description,
            sort_order
          )
        ),
        indicators (
          id,
          ref_code,
          name,
          description,
          sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching framework:", error);
    throw error;
  }

  return data as Pillar[];
}

/**
 * Fetch a single pillar by ID (with themes and subthemes).
 */
export async function getPillarById(id: string): Promise<Pillar | null> {
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
        subthemes (
          id,
          ref_code,
          name,
          description,
          sort_order,
          theme_id,
          indicators (
            id,
            ref_code,
            name,
            description,
            sort_order
          )
        ),
        indicators (
          id,
          ref_code,
          name,
          description,
          sort_order
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching pillar ${id}:`, error);
    return null;
  }

  return data as Pillar;
}
