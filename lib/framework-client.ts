// lib/framework-client.ts
import { getSupabaseClient } from "@/lib/supabase-browser";

export type Pillar = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  themes?: Theme[];
};

export type Theme = {
  id: string;
  pillar_id: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes?: Subtheme[];
};

export type Subtheme = {
  id: string;
  theme_id: string;
  name: string;
  description: string;
  sort_order: number;
};

export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = getSupabaseClient();

  // Fetch pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pillarError) throw pillarError;

  if (!pillars) return [];

  // Fetch themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, pillar_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (themeError) throw themeError;

  // Fetch subthemes
  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, theme_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (subthemeError) throw subthemeError;

  // Nest data
  const themesByPillar: Record<string, Theme[]> = {};
  const subthemesByTheme: Record<string, Subtheme[]> = {};

  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({ ...t, subthemes: [] });
  });

  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push(s);
  });

  return (pillars || []).map((p) => ({
    ...p,
    themes: (themesByPillar[p.id] || []).map((t) => ({
      ...t,
      subthemes: subthemesByTheme[t.id] || [],
    })),
  }));
}
