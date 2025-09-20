// lib/framework-client.ts
import { createClient } from "@/lib/supabase-server";

// Inline row types for safety
export type Pillar = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
};

export type Theme = {
  id: string;
  pillar_id: string; // ✅ ensure TS knows pillar_id exists
  name: string;
  description: string;
  sort_order: number;
};

export type Subtheme = {
  id: string;
  theme_id: string; // ✅ ensure TS knows theme_id exists
  name: string;
  description: string;
  sort_order: number;
};

// Shape returned to UI
export type Framework = Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] };

// -----------------------------
// Fetch Framework
// -----------------------------
export async function fetchFramework(): Promise<Framework[]> {
  const supabase = await createClient();

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

  // Index themes by pillar
  const themesByPillar: Record<string, (Theme & { subthemes: Subtheme[] })[]> = {};
  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({ ...t, subthemes: [] });
  });

  // Index subthemes by theme
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push(s);
  });

  // Nest everything
  return (pillars || []).map((p) => ({
    ...p,
    themes: (themesByPillar[p.id] || []).map((t) => ({
      ...t,
      subthemes: subthemesByTheme[t.id] || [],
    })),
  }));
}
