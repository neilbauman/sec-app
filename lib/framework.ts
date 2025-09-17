// /lib/framework.ts
import { createServerSupabase } from "@/lib/supabase-server";
import type { Pillar } from "@/types/framework";

export async function getFramework(): Promise<Pillar[]> {
  // ✅ Await the client
  const supabase = await createServerSupabase();

  // ✅ Now you can query
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order, themes(id, name, description, sort_order, subthemes(id, name, description, sort_order))");

  if (pillarError) {
    console.error("Error fetching framework:", pillarError);
    return [];
  }

  return pillars ?? [];
}
