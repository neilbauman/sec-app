// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { recalcRefCodes } from "@/lib/framework-utils";

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("pillars").insert([{ name: "New Pillar" }]).select().single();
  if (error) throw error;

  const newPillar: NestedPillar = {
    id: data.id,
    ref_code: "",
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    themes: [],
  };

  return recalcRefCodes([...pillars, newPillar]);
}

export async function addTheme(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("themes").insert([{ name: "New Theme", pillar_id: pillarId }]).select().single();
  if (error) throw error;

  const newTheme: NestedTheme = {
    id: data.id,
    pillar_id: pillarId, // ✅ ensure pillar_id exists
    ref_code: "",
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    subthemes: [],
  };

  return recalcRefCodes(
    pillars.map((p) => (p.id === pillarId ? { ...p, themes: [...p.themes, newTheme] } : p))
  );
}

export async function addSubtheme(pillars: NestedPillar[], pillarId: string, themeId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("subthemes").insert([{ name: "New Subtheme", theme_id: themeId }]).select().single();
  if (error) throw error;

  const newSub: NestedSubtheme = {
    id: data.id,
    theme_id: themeId,
    ref_code: "",
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
  };

  return recalcRefCodes(
    pillars.map((p) =>
      p.id === pillarId
        ? {
            ...p,
            themes: p.themes.map((t) =>
              t.id === themeId ? { ...t, subthemes: [...t.subthemes, newSub] } : t
            ),
          }
        : p
    )
  );
}

// ---------- Remove ----------
export async function removePillar(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").delete().eq("id", pillarId);
  if (error) throw error;

  return recalcRefCodes(pillars.filter((p) => p.id !== pillarId));
}

export async function removeTheme(pillars: NestedPillar[], pillarId: string, themeId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").delete().eq("id", themeId);
  if (error) throw error;

  return recalcRefCodes(
    pillars.map((p) =>
      p.id === pillarId ? { ...p, themes: p.themes.filter((t) => t.id !== themeId) } : p
    )
  );
}

export async function removeSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", subId);
  if (error) throw error;

  return recalcRefCodes(
    pillars.map((p) =>
      p.id === pillarId
        ? {
            ...p,
            themes: p.themes.map((t) =>
              t.id === themeId ? { ...t, subthemes: t.subthemes.filter((s) => s.id !== subId) } : t
            ),
          }
        : p
    )
  );
}

// ---------- Update ----------
export async function updateRow(
  pillars: NestedPillar[],
  type: "pillar" | "theme" | "subtheme",
  id: string,
  updates: Partial<NestedPillar | NestedTheme | NestedSubtheme>
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  let table = "";
  if (type === "pillar") table = "pillars";
  if (type === "theme") table = "themes";
  if (type === "subtheme") table = "subthemes";

  const { error } = await supabase.from(table).update(updates).eq("id", id);
  if (error) throw error;

  // update in memory
  return recalcRefCodes(
    pillars.map((p) => {
      if (type === "pillar" && p.id === id) return { ...p, ...updates };
      if (type === "theme") {
        return {
          ...p,
          themes: p.themes.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        };
      }
      if (type === "subtheme") {
        return {
          ...p,
          themes: p.themes.map((t) => ({
            ...t,
            subthemes: t.subthemes.map((s) => (s.id === id ? { ...s, ...updates } : s)),
          })),
        };
      }
      return p;
    })
  );
}
