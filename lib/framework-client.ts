"use server";

import { getSupabaseClient } from "@/lib/supabase-server";
import type { Database } from "@/types/supabase";

// ---------- Types ----------
export type Pillar = Database["public"]["Tables"]["pillars"]["Row"];
export type Theme = Database["public"]["Tables"]["themes"]["Row"];
export type Subtheme = Database["public"]["Tables"]["subthemes"]["Row"];

export type PillarInsert = Database["public"]["Tables"]["pillars"]["Insert"];
export type ThemeInsert = Database["public"]["Tables"]["themes"]["Insert"];
export type SubthemeInsert = Database["public"]["Tables"]["subthemes"]["Insert"];

export type NestedTheme = Theme & { subthemes: Subtheme[] };
export type NestedPillar = Pillar & { themes: NestedTheme[] };

// ---------- Fetch full framework ----------
export async function fetchFramework(): Promise<NestedPillar[]> {
  const supabase = await getSupabaseClient();

  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });

  if (pillarError) throw pillarError;

  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (themeError) throw themeError;

  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (subthemeError) throw subthemeError;

  // Group subthemes under themes
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push(s);
  });

  // Group themes under pillars
  const themesByPillar: Record<string, NestedTheme[]> = {};
  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({ ...t, subthemes: subthemesByTheme[t.id] || [] });
  });

  // Nest everything
  return (pillars || []).map((p) => ({
    ...p,
    themes: themesByPillar[p.id] || [],
  }));
}
