// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { cloneFramework, regenerateFramework } from "@/lib/framework-utils";

/**
 * ---------- Add ----------
 */
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("pillars")
    .insert({
      name: "Untitled Pillar",
      description: "",
      sort_order: pillars.length + 1,
    })
    .select()
    .single();

  if (error) throw error;

  const newPillar: NestedPillar = {
    id: data.id,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    themes: [],
  };

  return regenerateFramework([...pillars, newPillar]);
}

export async function addTheme(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const pillar = pillars.find((p) => p.id === pillarId);
  if (!pillar) return pillars;

  const { data, error } = await supabase
    .from("themes")
    .insert({
      pillar_id: pillarId,
      name: "Untitled Theme",
      description: "",
      sort_order: pillar.themes.length + 1,
    })
    .select()
    .single();

  if (error) throw error;

  const newTheme: NestedTheme = {
    id: data.id,
    pillar_id: pillarId,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    subthemes: [],
  };

  const cloned = cloneFramework(pillars);
  const target = cloned.find((p) => p.id === pillarId);
  if (target) target.themes.push(newTheme);

  return regenerateFramework(cloned);
}

export async function addSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const pillar = pillars.find((p) => p.id === pillarId);
  const theme = pillar?.themes.find((t) => t.id === themeId);
  if (!pillar || !theme) return pillars;

  const { data, error } = await supabase
    .from("subthemes")
    .insert({
      theme_id: themeId,
      name: "Untitled Subtheme",
      description: "",
      sort_order: theme.subthemes.length + 1,
    })
    .select()
    .single();

  if (error) throw error;

  const newSub: NestedSubtheme = {
    id: data.id,
    theme_id: themeId,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
  };

  const cloned = cloneFramework(pillars);
  const targetTheme = cloned
    .find((p) => p.id === pillarId)
    ?.themes.find((t) => t.id === themeId);
  if (targetTheme) targetTheme.subthemes.push(newSub);

  return regenerateFramework(cloned);
}

/**
 * ---------- Remove ----------
 */
export async function removePillar(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  await supabase.from("pillars").delete().eq("id", pillarId);

  const cloned = cloneFramework(pillars).filter((p) => p.id !== pillarId);
  return regenerateFramework(cloned);
}

export async function removeTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  await supabase.from("themes").delete().eq("id", themeId);

  const cloned = cloneFramework(pillars);
  const target = cloned.find((p) => p.id === pillarId);
  if (target) {
    target.themes = target.themes.filter((t) => t.id !== themeId);
  }

  return regenerateFramework(cloned);
}

export async function removeSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  await supabase.from("subthemes").delete().eq("id", subId);

  const cloned = cloneFramework(pillars);
  const targetTheme = cloned.find((p) => p.id === pillarId)?.themes.find((t) => t.id === themeId);
  if (targetTheme) {
    targetTheme.subthemes = targetTheme.subthemes.filter((s) => s.id !== subId);
  }

  return regenerateFramework(cloned);
}

/**
 * ---------- Update ----------
 */
export async function updateRow<T extends NestedPillar | NestedTheme | NestedSubtheme>(
  pillars: NestedPillar[],
  updatedRow: T
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const table =
    "pillar_id" in updatedRow ? "themes" : "theme_id" in updatedRow ? "subthemes" : "pillars";

  await supabase.from(table).update({
    name: updatedRow.name,
    description: updatedRow.description,
    sort_order: updatedRow.sort_order,
  }).eq("id", updatedRow.id);

  // Update local tree
  const cloned = cloneFramework(pillars);

  if ("pillar_id" in updatedRow) {
    // Theme
    const pillar = cloned.find((p) => p.id === updatedRow.pillar_id);
    if (pillar) {
      const idx = pillar.themes.findIndex((t) => t.id === updatedRow.id);
      if (idx >= 0) pillar.themes[idx] = updatedRow as NestedTheme;
    }
  } else if ("theme_id" in updatedRow) {
    // Subtheme
    for (const pillar of cloned) {
      const theme = pillar.themes.find((t) => t.id === updatedRow.theme_id);
      if (theme) {
        const idx = theme.subthemes.findIndex((s) => s.id === updatedRow.id);
        if (idx >= 0) theme.subthemes[idx] = updatedRow as NestedSubtheme;
      }
    }
  } else {
    // Pillar
    const idx = cloned.findIndex((p) => p.id === updatedRow.id);
    if (idx >= 0) cloned[idx] = updatedRow as NestedPillar;
  }

  return regenerateFramework(cloned);
}
