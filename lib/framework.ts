// /lib/framework.ts
import { createClient } from "./supabase-server";
import type { Pillar } from "@/types/framework";

export async function getFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(`
      id,
      name,
      description,
      sort_order,
      themes (
        id,
        name,
        description,
        sort_order,
        subthemes (
          id,
          name,
          description,
          sort_order
        )
      )
    `)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("❌ Error fetching pillars:", error.message);
    return [];
  }

  console.log("✅ Supabase data:", data); // DEBUG
  return (data as Pillar[]) || [];
}
