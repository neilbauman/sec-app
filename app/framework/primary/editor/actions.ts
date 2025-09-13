// app/framework/primary/editor/actions.ts
"use server";

import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types";

/**
 * Fetch all pillars — debug version
 * Just pulls straight from `pillars` to confirm Supabase + RLS are working.
 */
export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select("*");

  if (error) {
    console.error("Error fetching pillars:", error);
    return [];
  }

  console.log("✅ Pillars data:", data);
  return data ?? [];
}
