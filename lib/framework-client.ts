// lib/framework-client.ts
import { getSupabaseClient } from "./supabase-server";
import type { Database } from "@/types/supabase";

// Explicit row types
export type Pillar = Database["public"]["Tables"]["pillars"]["Row"];
export type Theme = Database["public"]["Tables"]["themes"]["Row"];
export type Subtheme = Database["public"]["Tables"]["subthemes"]["Row"];

export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = getSupabaseClient();

  // Fetch pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pillarError) throw pillarError;

  // Fetch themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, name, description, sort_order, pillar_id")
    .order("sort_order", { ascending: true });

  if (themeError) throw themeError;

  // Fetch subthemes
  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, name, description, sort_order, theme_id")
    .order("sort_order", { ascending: true });

  if (subthemeError) throw subthemeError;

  // Index themes by pillar
  const themesByPillar: Record<string, Theme[]> = {};
  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({ ...t, subthemes: [] as Subtheme[] });
  });

  // Index subthemes by theme
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push(s);
  });

  // Build full hierarchy
  return (pillars || []).map((p) => ({
    ...p,
    themes: (themesByPillar[p.id] || []).map((t) => ({
      ...t,
      subthemes: subthemesByTheme[t.id] || [],
    })),
  }));
}
