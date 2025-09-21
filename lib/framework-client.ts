// lib/framework-client.ts
import type { Database } from "@/types/supabase";
import { createClient } from "@/lib/supabase-server";

// ---------- Base Table Types ----------
export type Pillar = Database["public"]["Tables"]["pillars"]["Row"];
export type Theme = Database["public"]["Tables"]["themes"]["Row"];
export type Subtheme = Database["public"]["Tables"]["subthemes"]["Row"];

// ---------- Nested Types ----------
export type NestedSubtheme = Subtheme & { ref_code: string; theme_code: string };
export type NestedTheme = Theme & {
  ref_code: string;
  pillar_code: string;
  subthemes: NestedSubtheme[];
};
export type NestedPillar = Pillar & {
  ref_code: string;
  themes: NestedTheme[];
};

// ---------- Client Factory ----------
export function getSupabaseClient() {
  return createClient();
}

// ---------- Fetch Framework Helper ----------
export async function fetchFramework(): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  // Pull raw DB rows
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
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push(s);
  });

  // Group themes by pillar
  const themesByPillar: Record<string, Theme[]> = {};
  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push(t);
  });

  // 🔑 Normalize with ref codes
  return (pillars || []).map((p, pi) => {
    const pillarCode = `P${pi + 1}`;
    return {
      ...p,
      ref_code: pillarCode,
      themes: (themesByPillar[p.id] || []).map((t, ti) => {
        const themeCode = `T${pi + 1}.${ti + 1}`;
        return {
          ...t,
          ref_code: themeCode,
          pillar_code: pillarCode,
          subthemes: (subthemesByTheme[t.id] || []).map((s, si) => {
            const subCode = `ST${pi + 1}.${ti + 1}.${si + 1}`;
            return {
              ...s,
              ref_code: subCode,
              theme_code: themeCode,
            };
          }),
        };
      }),
    };
  });
}
