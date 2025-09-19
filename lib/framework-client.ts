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
 * Fetches the current (latest) framework version with its full hierarchy.
 * Returns an array of pillars, each with nested themes, subthemes, and indicators.
 */
export async function fetchFramework(): Promise<Pillar[]> {
  // Step 1: find the latest framework version
  const { data: version, error: versionError } = await supabase
    .from("primary_framework_versions")
    .select("id, version_number")
    .order("version_number", { ascending: false })
    .limit(1)
    .single();

  if (versionError || !version) {
    throw new Error(versionError?.message || "No framework version found");
  }

  // Step 2: fetch the pillars for that version
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
    throw new Error(error.message);
  }

  return (data ?? []) as Pillar[];
}
