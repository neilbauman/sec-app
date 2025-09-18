// /lib/framework.ts
import { createClient } from "./supabase-server";

export type Pillar = {
  id: number;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export async function getPrimaryFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  // adjust table name/columns if your schema differs
  const { data, error } = await supabase
    .from("pillars")
    .select("id, ref_code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching primary framework:", error);
    return [];
  }

  return data ?? [];
}
