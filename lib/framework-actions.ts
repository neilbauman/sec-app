// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { cloneFramework, recalcRefCodes } from "@/lib/framework-utils";
import { v4 as uuidv4 } from "uuid";

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("pillars")
    .insert([{ id: uuidv4(), name: "New Pillar", description: "", sort_order: pillars.length + 1 }])
    .select()
    .single();
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

export async function addTheme(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const pillar = pillars.find((p) => p.id === pillarId);
  if (!pillar) return pillars;

  const { data, error } = await supabase
    .from("themes")
    .insert([
      {
        id: uuidv4(),
        pillar_id: pillarId,
        name: "New Theme",
        description: "",
        sort_order: pillar.themes.length + 1,
      },
    ])
    .select()
    .single();
  if (error) throw error;

  const newTheme: NestedTheme = {
    id: data.id,
    ref_code: "",
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    subthemes: [],
  };

  const updated = cloneFramework(pillars);
  const target = updated.find((p) => p.id === pillarId);
  if (target) target.themes.push(newTheme);

  return recalcRefCodes(updated);
}

export async function addSubtheme(
  pillars: NestedPillar[],
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  // find theme
  let parentTheme: NestedTheme | undefined;
  let parentPillarId: string | undefined;
  for (const pillar of pillars) {
    const theme = pillar.themes.find((t) => t.id === themeId);
    if (theme) {
      parentTheme = theme;
      parentPillarId = pillar.id;
      break;
    }
  }
  if (!parentTheme || !parentPillarId) return pillars;

  const { data, error } = await supabase
    .from("subthemes")
    .insert([
      {
        id: uuidv4(),
        theme_id: themeId,
        name: "New Subtheme",
        description: "",
        sort_order: parentTheme.subthemes.length + 1,
      },
    ])
    .select()
    .single();
  if (error) throw error;

  const newSub: NestedSubtheme = {
    id: data.id,
    ref_code: "",
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
  };

  const updated = cloneFramework(pillars);
  for (const p of updated) {
    const t = p.themes.find((t) => t.id === themeId);
    if (t) {
      t.subthemes.push(newSub);
      break;
    }
  }

  return recalcRefCodes(updated);
}

// ---------- Remove ----------
export async function removePillar(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").delete().eq("id", pillarId);
  if (error) throw error;

  const updated = pillars.filter((p) => p.id !== pillarId);
  return recalcRefCodes(updated);
}

export async function removeTheme(
  pillars: NestedPillar[],
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").delete().eq("id", themeId);
  if (error) throw error;

  const updated = cloneFramework(pillars).map((p) => ({
    ...p,
    themes: p.themes.filter((t) => t.id !== themeId),
  }));

  return recalcRefCodes(updated);
}

export async function removeSubtheme(
  pillars: NestedPillar[],
  subthemeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", subthemeId);
  if (error) throw error;

  const updated = cloneFramework(pillars).map((p) => ({
    ...p,
    themes: p.themes.map((t) => ({
      ...t,
      subthemes: t.subthemes.filter((s) => s.id !== subthemeId),
    })),
  }));

  return recalcRefCodes(updated);
}

// ---------- Move ----------
export function movePillar(
  pillars: NestedPillar[],
  pillarId: string,
  direction: "up" | "down"
): NestedPillar[] {
  const updated = cloneFramework(pillars);
  const idx = updated.findIndex((p) => p.id === pillarId);
  if (idx === -1) return pillars;

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= updated.length) return pillars;

  [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
  return recalcRefCodes(updated);
}

export function moveTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  direction: "up" | "down"
): NestedPillar[] {
  const updated = cloneFramework(pillars);
  const pillar = updated.find((p) => p.id === pillarId);
  if (!pillar) return pillars;

  const idx = pillar.themes.findIndex((t) => t.id === themeId);
  if (idx === -1) return pillars;

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= pillar.themes.length) return pillars;

  [pillar.themes[idx], pillar.themes[swapIdx]] = [pillar.themes[swapIdx], pillar.themes[idx]];
  return recalcRefCodes(updated);
}

export function moveSubtheme(
  pillars: NestedPillar[],
  themeId: string,
  subId: string,
  direction: "up" | "down"
): NestedPillar[] {
  const updated = cloneFramework(pillars);

  for (const pillar of updated) {
    const theme = pillar.themes.find((t) => t.id === themeId);
    if (!theme) continue;

    const idx = theme.subthemes.findIndex((s) => s.id === subId);
    if (idx === -1) return pillars;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= theme.subthemes.length) return pillars;

    [theme.subthemes[idx], theme.subthemes[swapIdx]] = [
      theme.subthemes[swapIdx],
      theme.subthemes[idx],
    ];
    return recalcRefCodes(updated);
  }

  return pillars;
}
