// /lib/framework.ts
import { createClient } from "./supabase-server";

export type Pillar = {
  id: number;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;
  // add themes later if needed
};

export async function getPrimaryFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars") // table name in your DB
    .select("id, ref_code, name, description, sort_order")
    .order("sort_order");

  if (error) {
    console.error("❌ Error fetching primary framework:", error);
    return [];
  }

  return data as Pillar[];
}
