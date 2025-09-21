// lib/framework-client.ts
import { createClient } from "@supabase/supabase-js";

// ---------- Types ----------

export type Pillar = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  default_indicator_id?: string | null;
};

export type Theme = {
  id: string;
  theme_id: string; // ✅ FK to pillars.id
  name: string;
  description: string | null;
  sort_order: number;
  default_indicator_id?: string | null;
};

export type Subtheme = {
  id: string;
  theme_id: string; // ✅ FK to themes.id
  name: string;
  description: string | null;
  sort_order: number;
  default_indicator_id?: string | null;
};

// Nested structures for UI
export type NestedSubtheme = Subtheme & {
  ref_code: string;
};

export type NestedTheme = Theme & {
  ref_code: string;
  subthemes: NestedSubtheme[];
};

export type NestedPillar = Pillar & {
  ref_code: string;
  themes: NestedTheme[];
};

// ---------- Supabase client ----------

export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ---------- Update helpers ----------

export async function updatePillar(
  id: string,
  fields: Partial<Pick<Pillar, "name" | "description">>
) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").update(fields).eq("id", id);
  if (error) throw error;
}

export async function updateTheme(
  id: string,
  fields: Partial<Pick<Theme, "name" | "description">>
) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").update(fields).eq("id", id);
  if (error) throw error;
}

export async function updateSubtheme(
  id: string,
  fields: Partial<Pick<Subtheme, "name" | "description">>
) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").update(fields).eq("id", id);
  if (error) throw error;
}

// ---------- Fetch framework (pillars → themes → subthemes) ----------

export async function fetchFramework(): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  // Fetch all pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });

  if (pillarError) throw pillarError;
  if (!pillars) return [];

  // Fetch all themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (themeError) throw themeError;

  // Fetch all subthemes
  const { data: subthemes, error: subError } = await supabase
    .from("subthemes")
    .select("*")
    .order("sort_order", { ascending: true });

  if (subError) throw subError;

  // Build nested structure
  const nested: NestedPillar[] = (pillars || []).map((p, pIdx) => {
    const pillarThemes = (themes || [])
      .filter((t) => t.theme_id === p.id) // ✅ FK link
      .map((t, tIdx) => {
        const themeSubs = (subthemes || [])
          .filter((s) => s.theme_id === t.id) // ✅ FK link
          .map((s, sIdx) => ({
            ...s,
            ref_code: `ST${pIdx + 1}.${tIdx + 1}.${sIdx + 1}`,
          }));

        return {
          ...t,
          ref_code: `T${pIdx + 1}.${tIdx + 1}`,
          subthemes: themeSubs,
        };
      });

    return {
      ...p,
      ref_code: `P${pIdx + 1}`,
      themes: pillarThemes,
    };
  });

  return nested;
}
