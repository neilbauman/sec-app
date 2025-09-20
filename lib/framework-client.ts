"use client";

import { getSupabaseClient } from "@/lib/supabase-server";

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
  name: string;
  description: string;
  sort_order: number;
};

export type Subtheme = {
  id: string;
  theme_id: string;
  name: string;
  description: string;
  sort_order: number;
};

export type FrameworkTree = Pillar & {
  themes: (Theme & { subthemes: Subtheme[] })[];
};

// -------- Fetch Framework (full tree) --------
export async function fetchFramework(): Promise<FrameworkTree[]> {
  const supabase = await getSupabaseClient();

  const { data: pillars, error: pillarError } = await supabase.from("pillars").select("*").order("sort_order");
  if (pillarError) throw pillarError;

  const { data: themes, error: themeError } = await supabase.from("themes").select("*").order("sort_order");
  if (themeError) throw themeError;

  const { data: subthemes, error: subthemeError } = await supabase.from("subthemes").select("*").order("sort_order");
  if (subthemeError) throw subthemeError;

  const themesByPillar: Record<string, (Theme & { subthemes: Subtheme[] })[]> = {};
  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({ ...t, subthemes: [] });
  });

  const subthemesByTheme: Record<string, Subtheme[]> = {};
  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push(s);
  });

  Object.values(themesByPillar).forEach((themeList) => {
    themeList.forEach((theme) => {
      theme.subthemes = subthemesByTheme[theme.id] || [];
    });
  });

  return (pillars || []).map((p) => ({
    ...p,
    themes: themesByPillar[p.id] || [],
  }));
}
