// lib/framework-actions.ts
import type { NestedPillar } from "@/lib/framework-client";
import { cloneFramework } from "@/lib/framework-utils";
import { v4 as uuidv4 } from "uuid";

// ---------- Add ----------
export function addPillar(pillars: NestedPillar[]): NestedPillar[] {
  const copy = cloneFramework(pillars);
  copy.push({
    id: uuidv4(),
    name: "Untitled Pillar",
    description: "",
    sort_order: copy.length + 1,
    ref_code: "", // will be recalculated later
    themes: [],
  });
  return copy;
}

export function addTheme(
  pillars: NestedPillar[],
  pillarId: string
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (pillar) {
    pillar.themes.push({
      id: uuidv4(),
      name: "Untitled Theme",
      description: "",
      pillar_id: pillar.id,
      sort_order: pillar.themes.length + 1,
      ref_code: "",
      subthemes: [],
    });
  }
  return copy;
}

export function addSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  const theme = pillar?.themes.find((t) => t.id === themeId);
  if (theme) {
    theme.subthemes.push({
      id: uuidv4(),
      name: "Untitled Subtheme",
      description: "",
      theme_id: theme.id,
      sort_order: theme.subthemes.length + 1,
      ref_code: "",
    });
  }
  return copy;
}

// ---------- Remove ----------
export function removePillar(pillars: NestedPillar[], pillarId: string) {
  return cloneFramework(pillars).filter((p) => p.id !== pillarId);
}

export function removeTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
) {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (pillar) {
    pillar.themes = pillar.themes.filter((t) => t.id !== themeId);
  }
  return copy;
}

export function removeSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subthemeId: string
) {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  const theme = pillar?.themes.find((t) => t.id === themeId);
  if (theme) {
    theme.subthemes = theme.subthemes.filter((s) => s.id !== subthemeId);
  }
  return copy;
}

// ---------- Move ----------
function move<T>(arr: T[], index: number, dir: "up" | "down"): void {
  const target = dir === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= arr.length) return;
  [arr[index], arr[target]] = [arr[target], arr[index]];
}

export function movePillar(
  pillars: NestedPillar[],
  pillarId: string,
  dir: "up" | "down"
) {
  const copy = cloneFramework(pillars);
  const idx = copy.findIndex((p) => p.id === pillarId);
  if (idx >= 0) move(copy, idx, dir);
  return copy;
}

export function moveTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  dir: "up" | "down"
) {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (pillar) {
    const idx = pillar.themes.findIndex((t) => t.id === themeId);
    if (idx >= 0) move(pillar.themes, idx, dir);
  }
  return copy;
}

export function moveSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subthemeId: string,
  dir: "up" | "down"
) {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  const theme = pillar?.themes.find((t) => t.id === themeId);
  if (theme) {
    const idx = theme.subthemes.findIndex((s) => s.id === subthemeId);
    if (idx >= 0) move(theme.subthemes, idx, dir);
  }
  return copy;
}
