// lib/framework.ts
import { createServerSupabase } from "@/lib/supabase-server";

export type { Pillar, Theme, Subtheme } from "@/types/framework";

export async function fetchFrameworkList() {
  const supabase = await createServerSupabase();

  const [pillarsRes, themesRes, subthemesRes] = await Promise.all([
    supabase
      .from("pillars")
      .select("id, code, name, description, sort_order")
      .order("sort_order"),
    supabase
      .from("themes")
      .select("id, code, name, description, sort_order, pillar_id")
      .order("sort_order"),
    supabase
      .from("subthemes")
      .select("id, code, name, description, sort_order, theme_id")
      .order("sort_order"),
  ]);

  return {
    pillars: pillarsRes.data ?? [],
    themes: themesRes.data ?? [],
    subthemes: subthemesRes.data ?? [],
  };
}
