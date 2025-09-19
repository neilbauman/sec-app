// lib/framework-client.ts
import { supabase } from "./supabase-client";
import { Database } from "@/types/supabase";

/**
 * Pillar type with nested themes → subthemes → indicators
 */
export type Pillar = Database["public"]["Tables"]["pillars"]["Row"] & {
  themes: (Database["public"]["Tables"]["themes"]["Row"] & {
    subthemes: (Database["public"]["Tables"]["subthemes"]["Row"] & {
      indicators: Database["public"]["Tables"]["indicators"]["Row"][];
    })[];
  })[];
};

/**
 * Fetch framework data (pillars with nested themes, subthemes, indicators).
 * This simplified version ignores framework versions and returns everything.
 */
export async function fetchFramework(): Promise<Pillar[]> {
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
          sort_order,
          indicators (
            id,
            ref_code,
            name,
            description,
            level,
            sort_order
          )
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Supabase fetchFramework error:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}
