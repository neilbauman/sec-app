// lib/framework-actions.ts
import { v4 as uuidv4 } from "uuid";
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/types";
import { cloneFramework, recalcRefCodes } from "@/lib/framework-utils";

// ---------- Add ----------

export function addPillar(copy: NestedPillar[]): NestedPillar[] {
  const newPillar: NestedPillar = {
    id: uuidv4(),
    name: "Untitled Pillar",
    description: "",
    refCode: "",
    sortOrder: copy.length,
    type: "Pillar",
    children: [], // ✅ was themes
  };
  const updated = [...copy, newPillar];
  return recalcRefCodes(updated);
}

export function addTheme(pillar: NestedPillar): NestedPillar {
  const newTheme: NestedTheme = {
    id: uuidv4(),
    name: "Untitled Theme",
    description: "",
    refCode: "",
    sortOrder: pillar.children?.length ?? 0,
    type: "Theme",
    children: [], // ✅ was subthemes
  };
  const updated = cloneFramework(pillar);
  updated.children = [...(updated.children ?? []), newTheme];
  return updated;
}

export function addSubtheme(theme: NestedTheme): NestedTheme {
  const newSubtheme: NestedSubtheme = {
    id: uuidv4(),
    name: "Untitled Subtheme",
    description: "",
    refCode: "",
    sortOrder: theme.children?.length ?? 0,
    type: "Subtheme",
  };
  const updated = { ...theme };
  updated.children = [...(theme.children ?? []), newSubtheme];
  return updated;
}
