import { getSupabaseClient } from "@/lib/supabase-server";

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
  subthemes?: Subtheme[];
};

export type Pillar = {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes?: Theme[];
};

// Fetches full framework hierarchy (pillars -> themes -> subthemes)
export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = getSupabaseClient();

  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order");

  if (pillarError) throw pillarError;

  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order");

  if (themeError) throw themeError;

  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("*")
    .order("sort_order");

  if (subthemeError) throw subthemeError;

  // Organize data into hierarchy
  const themesByPillar: Record<string, Theme[]> = {};
  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({ ...t, subthemes: [] });
  });

  const subthemesByTheme: Record<string, Subtheme[]> = {};
  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push(s);
  });

  const final = (pillars || []).map((p) => {
    const pillarThemes = themesByPillar[p.id] || [];
    pillarThemes.forEach((t) => {
      t.subthemes = subthemesByTheme[t.id] || [];
    });
    return { ...p, themes: pillarThemes };
  });

  return final;
}
