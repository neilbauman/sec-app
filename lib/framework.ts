// /lib/framework.ts
import { createClient } from "./supabase-server";

export type Pillar = {
  id: number;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

// ✅ Keep this as the canonical fetcher
export async function getFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select("id, ref_code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching framework:", error);
    return [];
  }

  return data ?? [];
}
