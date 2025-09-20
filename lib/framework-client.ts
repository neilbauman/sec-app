// lib/framework-client.ts
import type { Database } from "@/types/supabase";
import { createClient } from "@/lib/supabase-server";

// ---------- Base Table Types ----------
export type Pillar = Database["public"]["Tables"]["pillars"]["Row"];
export type Theme = Database["public"]["Tables"]["themes"]["Row"];
export type Subtheme = Database["public"]["Tables"]["subthemes"]["Row"];

// ---------- Insert Types (manual since DB types only export Row) ----------
export type PillarInsert = {
  id?: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
};

export type ThemeInsert = {
  id?: string;
  pillar_id: string;
  name: string;
  description: string;
  sort_order: number;
};

export type SubthemeInsert = {
  id?: string;
  theme_id: string;
  name: string;
  description: string;
  sort_order: number;
};

// ---------- Nested Types ----------
export type NestedSubtheme = Subtheme;
export type NestedTheme = Theme & { subthemes: NestedSubtheme[] };
export type NestedPillar = Pillar & { themes: NestedTheme[] };

// ---------- Client Factory ----------
export function getSupabaseClient() {
  return createClient();
}

// ---------- Fetch Framework Helper ----------
export async function fetchFramework(): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

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

  // Group subthemes by theme
  const subthemesByTheme: Record<string, NestedSubtheme[]> = {};
  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push(s);
  });

  // Group themes by pillar
  const themesByPillar: Record<string, NestedTheme[]> = {};
  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({
      ...t,
      subthemes: subthemesByTheme[t.id] || [],
    });
  });

  // Attach everything to pillars
  return (pillars || []).map((p) => ({
    ...p,
    themes: themesByPillar[p.id] || [],
  }));
}
