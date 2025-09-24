// lib/framework-server.ts
import { createClient } from "@/lib/supabase-server";
import { NestedPillar } from "@/lib/types";
import { normalizePillars } from "@/lib/framework-client";

/**
 * Fetch framework data directly from Supabase
 */
export async function getFrameworkFromDb(): Promise<NestedPillar[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("framework").select("*");

  if (error) {
    console.error("Error fetching framework:", error.message);
    throw new Error(error.message);
  }

  return normalizePillars(data ?? []);
}
