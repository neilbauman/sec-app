// lib/framework-actions.ts
import { v4 as uuidv4 } from "uuid";
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { cloneFramework, renumberAll } from "@/lib/framework-utils";
import { getSupabaseClient } from "@/lib/supabase-client";

// ---------- Local Draft Actions ----------

export function addPillar(pillars: NestedPillar[]): NestedPillar[] {
  const copy = cloneFramework(pillars);
  copy.push({
    id: uuidv4(),
    name: "Untitled Pillar",
    description: "",
    sort_order: copy.length + 1,
    ref_code: "",
    themes: [],
  });
  return renumberAll(copy);
}

export function removePillar(pillars: NestedPillar[], pillarId: string): NestedPillar[] {
  const copy = cloneFramework(pillars).filter((p) => p.id !== pillarId);
  return renumberAll(copy);
}

export function addTheme(pillars: NestedPillar[], pillarId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (pillar) {
    pillar.themes.push({
      id: uuidv4(),
      pillar_id: pillarId,
      name: "Untitled Theme",
      description: "",
      sort_order: pillar.themes.length + 1,
      ref_code: "",
      subthemes: [],
    });
  }
  return renumberAll(copy);
}

export function removeTheme(pillars: NestedPillar[], pillarId: string, themeId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (pillar) {
    pillar.themes = pillar.themes.filter((t) => t.id !== themeId);
  }
  return renumberAll(copy);
}

export function addSubtheme(pillars: NestedPillar[], pillarId: string, themeId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  const theme = pillar?.themes.find((t) => t.id === themeId);
  if (theme) {
    theme.subthemes.push({
      id: uuidv4(),
      theme_id: themeId,
      name: "Untitled Subtheme",
      description: "",
      sort_order: theme.subthemes.length + 1,
      ref_code: "",
    });
  }
  return renumberAll(copy);
}

export function removeSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subthemeId: string
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  const theme = pillar?.themes.find((t) => t.id === themeId);
  if (theme) {
    theme.subthemes = theme.subthemes.filter((s) => s.id !== subthemeId);
  }
  return renumberAll(copy);
}

// ---------- Moves ----------
export function movePillar(pillars: NestedPillar[], pillarId: string, dir: "up" | "down"): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const idx = copy.findIndex((p) => p.id === pillarId);
  if (idx === -1) return copy;
  const target = dir === "up" ? idx - 1 : idx + 1;
  if (target < 0 || target >= copy.length) return copy;
  [copy[idx], copy[target]] = [copy[target], copy[idx]];
  return renumberAll(copy);
}

export function moveTheme(pillars: NestedPillar[], pillarId: string, themeId: string, dir: "up" | "down"): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (!pillar) return copy;
  const idx = pillar.themes.findIndex((t) => t.id === themeId);
  if (idx === -1) return copy;
  const target = dir === "up" ? idx - 1 : idx + 1;
  if (target < 0 || target >= pillar.themes.length) return copy;
  [pillar.themes[idx], pillar.themes[target]] = [pillar.themes[target], pillar.themes[idx]];
  return renumberAll(copy);
}

export function moveSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subthemeId: string,
  dir: "up" | "down"
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  const theme = pillar?.themes.find((t) => t.id === themeId);
  if (!theme) return copy;
  const idx = theme.subthemes.findIndex((s) => s.id === subthemeId);
  if (idx === -1) return copy;
  const target = dir === "up" ? idx - 1 : idx + 1;
  if (target < 0 || target >= theme.subthemes.length) return copy;
  [theme.subthemes[idx], theme.subthemes[target]] = [theme.subthemes[target], theme.subthemes[idx]];
  return renumberAll(copy);
}

// ---------- Save ----------
export async function saveFramework(pillars: NestedPillar[]): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("framework").upsert(pillars, { onConflict: "id" });
  if (error) throw error;
}
