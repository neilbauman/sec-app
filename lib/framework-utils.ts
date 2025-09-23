// lib/framework-utils.ts
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

export type RefMeta = { code: string; dirty: boolean };

/**
 * Clone deeply to avoid state mutation
 */
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars));
}

/**
 * Recalculate ref codes consistently
 */
export function recalcRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  const newPillars = cloneFramework(pillars);

  newPillars.forEach((pillar, pIdx) => {
    pillar.ref_code = `P${pIdx + 1}`;
    pillar.themes.forEach((theme, tIdx) => {
      theme.ref_code = `${pillar.ref_code}.${tIdx + 1}`;
      theme.subthemes.forEach((sub, sIdx) => {
        sub.ref_code = `${theme.ref_code}.${sIdx + 1}`;
      });
    });
  });

  return newPillars;
}

/**
 * Build map of id → ref code + dirty flag
 */
export function buildRefCodeMap(
  pillars: NestedPillar[],
  dirtyIds: Set<string>
): Record<string, RefMeta> {
  const map: Record<string, RefMeta> = {};

  const walk = (items: (NestedPillar | NestedTheme | NestedSubtheme)[]) => {
    items.forEach((item) => {
      map[item.id] = {
        code: item.ref_code || "",
        dirty: dirtyIds.has(item.id),
      };

      if ("themes" in item) walk(item.themes);
      if ("subthemes" in item) walk(item.subthemes);
    });
  };

  walk(pillars);
  return map;
}
