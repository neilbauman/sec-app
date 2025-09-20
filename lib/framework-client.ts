// lib/framework-client.ts
// Client-safe helpers for fetching the SSC framework structure

"use client";

import { getSupabaseClient } from "@/lib/supabase-client";

export type Subtheme = {
  id: string;
  theme_id: string;
  name: string;
  description: string;
  sort_order: number;
};

export type Theme = {
  id: string;
  pillar_id: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
};

export type Pillar = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
};

/**
 * Fetch the full SSC framework, ordered hierarchically:
 * pillars → themes → subthemes
 */
export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = getSupabaseClient();

  // Fetch all three levels
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pillarError) throw pillarError;

  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, pillar_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (themeError) throw themeError;

  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, theme_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (subthemeError) throw subthemeError;

  // Group subthemes under their parent themes
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push(s);
  });

  // Group themes under their parent pillars
  const themesByPillar: Record<string, Theme[]> = {};
  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({
      ...t,
      subthemes: subthemesByTheme[t.id] || [],
    });
  });

  // Assemble the full structure
  return (pillars || []).map((p) => ({
    ...p,
    themes: themesByPillar[p.id] || [],
  }));
}
