// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";
import { recalcRefCodes, cloneFramework } from "@/lib/framework-utils";

/**
 * Utility: normalize sort_order for siblings (pillars, themes, subthemes).
 */
function normalizeSort<T extends { sort_order: number }>(items: T[]): void {
  items.forEach((item, idx) => {
    item.sort_order = idx + 1;
  });
}

/**
 * Save helper: upsert to a table.
 */
async function upsertRow(
  table: string,
  values: Record<string, any>
): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from(table).upsert(values);
  if (error) throw error;
}

/**
 * ---------- Add ----------
 */
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const updated = cloneFramework(pillars);
  const newPillar: NestedPillar = {
    id: crypto.randomUUID(),
    name: "Untitled Pillar",
    description: "",
    sort_order: updated.length + 1,
    themes: [],
  };
  updated.push(newPillar);
  normalizeSort(updated);

  await upsertRow("pillars", {
    id: newPillar.id,
    name: newPillar.name,
    description: newPillar.description,
    sort_order: newPillar.sort_order,
  });

  return recalcRefCodes(updated);
}

export async function addTheme(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const updated = cloneFramework(pillars);
  const pillar = updated.find((p) => p.id === pillarId);
  if (!pillar) return updated;

  const newTheme: NestedTheme = {
    id: crypto.randomUUID(),
    name: "Untitled Theme",
    description: "",
    sort_order: pillar.themes.length + 1,
    subthemes: [],
  };
  pillar.themes.push(newTheme);
  normalizeSort(pillar.themes);

  await upsertRow("themes", {
    id: newTheme.id,
    pillar_id: pillarId,
    name: newTheme.name,
    description: newTheme.description,
    sort_order: newTheme.sort_order,
  });

  return recalcRefCodes(updated);
}

export async function addSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const updated = cloneFramework(pillars);
  const pillar = updated.find((p) => p.id === pillarId);
  const theme = pillar?.themes.find((t) => t.id === themeId);
  if (!pillar || !theme) return updated;

  const newSub: NestedSubtheme = {
    id: crypto.randomUUID(),
    name: "Untitled Subtheme",
    description: "",
    sort_order: theme.subthemes.length + 1,
  };
  theme.subthemes.push(newSub);
  normalizeSort(theme.subthemes);

  await upsertRow("subthemes", {
    id: newSub.id,
    theme_id: themeId,
    name: newSub.name,
    description: newSub.description,
    sort_order: newSub.sort_order,
  });

  return recalcRefCodes(updated);
}

/**
 * ---------- Remove ----------
 */
export async function removePillar(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const updated = cloneFramework(pillars).filter((p) => p.id !== pillarId);
  normalizeSort(updated);

  const supabase = getSupabaseClient();
  await supabase.from("pillars").delete().eq("id", pillarId);

  return recalcRefCodes(updated);
}

export async function removeTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const updated = cloneFramework(pillars);
  const pillar = updated.find((p) => p.id === pillarId);
  if (!pillar) return updated;

  pillar.themes = pillar.themes.filter((t) => t.id !== themeId);
  normalizeSort(pillar.themes);

  const supabase = getSupabaseClient();
  await supabase.from("themes").delete().eq("id", themeId);

  return recalcRefCodes(updated);
}

export async function removeSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string
): Promise<NestedPillar[]> {
  const updated = cloneFramework(pillars);
  const pillar = updated.find((p) => p.id === pillarId);
  const theme = pillar?.themes.find((t) => t.id === themeId);
  if (!pillar || !theme) return updated;

  theme.subthemes = theme.subthemes.filter((s) => s.id !== subId);
  normalizeSort(theme.subthemes);

  const supabase = getSupabaseClient();
  await supabase.from("subthemes").delete().eq("id", subId);

  return recalcRefCodes(updated);
}

/**
 * ---------- Update ----------
 * Supports inline editing (name/description).
 */
export async function updateRow(
  type: "pillar" | "theme" | "subtheme",
  id: string,
  values: { name?: string; description?: string }
): Promise<void> {
  const supabase = getSupabaseClient();
  const table =
    type === "pillar" ? "pillars" : type === "theme" ? "themes" : "subthemes";
  const { error } = await supabase.from(table).update(values).eq("id", id);
  if (error) throw error;
}
