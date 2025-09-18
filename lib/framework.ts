// /lib/framework.ts
import { createClient } from "./supabase-server";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export async function getFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  // ✅ Only select columns that actually exist
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select(
      `
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
    `
    )
    .order("sort_order", { ascending: true });

  if (pillarError) {
    console.error("Error fetching pillars:", pillarError);
    return [];
  }

  return (pillars as Pillar[]) || [];
}
