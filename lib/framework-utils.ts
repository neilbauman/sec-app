// lib/framework-utils.ts
import { v4 as uuidv4 } from "uuid";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

// Metadata for each item’s ref code
export type RefMeta = {
  code: string;
  dirty: boolean;
};
export type RefCodeMap = Record<string, RefMeta>;

/**
 * Create a deep clone of the framework to avoid mutating state directly
 */
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars));
}

/**
 * Generate hierarchical reference codes for all pillars, themes, subthemes
 */
export function recalcRefCodes(pillars: NestedPillar[]): RefCodeMap {
  const map: RefCodeMap = {};

  pillars.forEach((pillar, pIndex) => {
    const pillarCode = `P${pIndex + 1}`;
    map[pillar.id] = { code: pillarCode, dirty: false };

    pillar.themes.forEach((theme, tIndex) => {
      const themeCode = `${pillarCode}.T${tIndex + 1}`;
      map[theme.id] = { code: themeCode, dirty: false };

      theme.subthemes.forEach((sub, sIndex) => {
        const subCode = `${themeCode}.S${sIndex + 1}`;
        map[sub.id] = { code: subCode, dirty: false };
      });
    });
  });

  return map;
}

/**
 * Mark items that will change on save
 */
export function markDirty(
  oldMap: RefCodeMap,
  newMap: RefCodeMap
): RefCodeMap {
  const merged: RefCodeMap = {};
  Object.keys(newMap).forEach((id) => {
    const old = oldMap[id]?.code;
    const current = newMap[id].code;
    merged[id] = {
      code: current,
      dirty: old !== undefined && old !== current,
    };
  });
  return merged;
}
