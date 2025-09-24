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
    children: [],
  };
  const updated = [...copy, newPillar];
  return recalcRefCodes(updated);
}

export function addTheme(framework: NestedPillar[], pillarId: string): NestedPillar[] {
  const updated = cloneFramework(framework); // ✅ clone the whole framework
  const pillar = updated.find((p) => p.id === pillarId);
  if (!pillar) return updated;

  const newTheme: NestedTheme = {
    id: uuidv4(),
    name: "Untitled Theme",
    description: "",
    refCode: "",
    sortOrder: pillar.children?.length ?? 0,
    type: "Theme",
    children: [],
  };

  pillar.children = [...(pillar.children ?? []), newTheme];
  return recalcRefCodes(updated);
}

export function addSubtheme(framework: NestedPillar[], themeId: string): NestedPillar[] {
  const updated = cloneFramework(framework); // ✅ clone the whole framework
  for (const pillar of updated) {
    const theme = pillar.children?.find((t) => t.id === themeId);
    if (theme) {
      const newSubtheme: NestedSubtheme = {
        id: uuidv4(),
        name: "Untitled Subtheme",
        description: "",
        refCode: "",
        sortOrder: theme.children?.length ?? 0,
        type: "Subtheme",
      };
      theme.children = [...(theme.children ?? []), newSubtheme];
      break;
    }
  }
  return recalcRefCodes(updated);
}
