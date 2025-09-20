// lib/framework-client.ts
import { getSupabaseClient } from "./supabase-server";

// ---------- Base Row Types ----------
export type Pillar = {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
};

export type Theme = {
  id: string;
  pillar_id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
};

export type Subtheme = {
  id: string;
  theme_id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
};

// ---------- Nested Types ----------
export type NestedTheme = Theme & { subthemes: Subtheme[] };
export type NestedPillar = Pillar & { themes: NestedTheme[] };

// ---------- Fetch Framework ----------
export async function fetchFramework(): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  // Fetch pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, ref_code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pillarError) throw pillarError;

  // Fetch themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, pillar_id, ref_code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (themeError) throw themeError;

  // Fetch subthemes
  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, theme_id, ref_code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (subthemeError) throw subthemeError;

  // Group subthemes under their themes
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push(s);
  });

  // Group themes (with subthemes) under their pillars
  const themesByPillar: Record<string, NestedTheme[]> = {};
  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({
      ...t,
      subthemes: subthemesByTheme[t.id] || [],
    });
  });

  // Build final nested pillars
  const nestedPillars: NestedPillar[] = (pillars || []).map((p) => ({
    ...p,
    themes: themesByPillar[p.id] || [],
  }));

  return nestedPillars;
}
