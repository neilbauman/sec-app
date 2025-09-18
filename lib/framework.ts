// /lib/framework.ts
import { createClient } from "./supabase-server";

export type Pillar = {
  id: number;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

// Placeholder for future use (instances / country configs may call it)
export async function getFramework(): Promise<unknown[]> {
  return [];
}

// Actual fetch for the Primary Editor
export async function getPrimaryFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select("id, ref_code, name, description, sort_order")
    .order("sort_order");

  if (error) {
    console.error("❌ Error fetching pillars:", error);
    return [];
  }

  return data as Pillar[];
}
