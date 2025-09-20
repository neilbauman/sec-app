// lib/framework-client.ts
import { getSupabaseClient } from "@/lib/supabase-client";

export type Pillar = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  themes?: Theme[];
};

export type Theme = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  pillar_id: string;
  subthemes?: Subtheme[];
};

export type Subtheme = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  theme_id: string;
};

/**
 * Fetch the full framework hierarchy (pillars → themes → subthemes)
 */
export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = getSupabaseClient();

  // Fetch pillars
  const { data: pillars, error: pErr } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order", { ascending: true });
  if (pErr) throw pErr;

  // Fetch themes
  const { data: themes, error: tErr } = await supabase
    .from("themes")
    .select("id, name, description, sort_order, pillar_id")
    .order("sort_order", { ascending: true });
  if (tErr) throw tErr;

  // Fetch subthemes
  const { data: subthemes, error: sErr } = await supabase
    .from("subthemes")
    .select("id, name, description, sort_order, theme_id")
    .order("sort_order", { ascending: true });
  if (sErr) throw sErr;

  // Organize subthemes by theme
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push(s);
  });

  // Organize themes by pillar
  const themesByPillar: Record<string, Theme[]> = {};
  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({ ...t, subthemes: subthemesByTheme[t.id] || [] });
  });

  // Attach everything to pillars
  return (pillars || []).map((p) => ({
    ...p,
    themes: themesByPillar[p.id] || [],
  }));
}
