// lib/framework-client.ts
import { createClient } from "@/lib/supabase-server";

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
  const supabase = createClient();

  // Fetch pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order");

  if (pillarError) throw pillarError;

  // Fetch themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, pillar_id, name, description, sort_order");

  if (themeError) throw themeError;

  // Fetch subthemes
  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, theme_id, name, description, sort_order");

  if (subthemeError) throw subthemeError;

  // Assemble hierarchy
  const themesByPillar: Record<string, Theme[]> = {};
  const subthemesByTheme: Record<string, Subtheme[]> = {};

  (themes ?? []).forEach((theme) => {
    if (!themesByPillar[theme.pillar_id]) themesByPillar[theme.pillar_id] = [];
    themesByPillar[theme.pillar_id].push({ ...theme, subthemes: [] });
  });

  (subthemes ?? []).forEach((subtheme) => {
    if (!subthemesByTheme[subtheme.theme_id]) subthemesByTheme[subtheme.theme_id] = [];
    subthemesByTheme[subtheme.theme_id].push(subtheme);
  });

  (Object.values(themesByPillar).flat()).forEach((theme) => {
    theme.subthemes = subthemesByTheme[theme.id] ?? [];
  });

  return (pillars ?? []).map((pillar) => ({
    ...pillar,
    themes: themesByPillar[pillar.id] ?? [],
  }));
}
