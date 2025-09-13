// lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";

export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select("*");

  if (error) {
    console.error("Error fetching framework:", error);
    return [];
  }

  console.log("Fetched pillars:", data);
  return data as Pillar[];
}
