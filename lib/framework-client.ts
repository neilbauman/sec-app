// /lib/framework-client.ts
"use client";

import { createClient } from "@/lib/supabase-browser";
import type { Pillar } from "@/types/framework";

const supabase = createClient();

export async function getFrameworkClient(): Promise<Pillar[]> {
  const { data, error } = await supabase.from("pillars").select(`
    id, name, description, sort_order,
    themes (
      id, name, description, sort_order,
      subthemes (
        id, name, description, sort_order
      )
    )
  `);

  if (error) {
    console.error("Error fetching framework (client):", error);
    return [];
  }
  return data as Pillar[];
}
