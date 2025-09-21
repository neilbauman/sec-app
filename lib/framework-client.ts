// lib/framework-client.ts
import type { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";

// ---------- Base Table Types (from DB, no ref_code anymore) ----------
export type Pillar = {
  id: string;
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

// ---------- Nested Types (app-level, add ref_code dynamically) ----------
export type NestedSubtheme = Subtheme & { ref_code: string };
export type NestedTheme = Theme & { ref_code: string; subthemes: NestedSubtheme[] };
export type NestedPillar = Pillar & { ref_code: string; themes: NestedTheme[] };

// ---------- Client Factory ----------
export function getSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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
  (subthemes || []).forEach((s, sIdx) => {
    const ref_code = `ST${s.sort_order ?? sIdx + 1}`;
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push({ ...s, ref_code });
  });

  // Group themes by pillar
  const themesByPillar: Record<string, NestedTheme[]> = {};
  (themes || []).forEach((t, tIdx) => {
    const ref_code = `T${t.sort_order ?? tIdx + 1}`;
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({
      ...t,
      ref_code,
      subthemes: subthemesByTheme[t.id] || [],
    });
  });

  // Attach everything to pillars
  return (pillars || []).map((p, pIdx) => {
    const ref_code = `P${p.sort_order ?? pIdx + 1}`;
    return {
      ...p,
      ref_code,
      themes: themesByPillar[p.id] || [],
    };
  });
}
