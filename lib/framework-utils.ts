// lib/framework-utils.ts
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

/**
 * Deep clone utility.
 */
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars));
}

/**
 * Renumber all items and regenerate ref codes (P1 → T1.1 → ST1.1.1).
 */
export function recalcRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((p, pi) => ({
    ...p,
    sort_order: pi + 1,
    ref_code: `P${pi + 1}`,
    themes: p.themes.map((t, ti) => ({
      ...t,
      sort_order: ti + 1,
      ref_code: `T${pi + 1}.${ti + 1}`,
      subthemes: t.subthemes.map((s, si) => ({
        ...s,
        sort_order: si + 1,
        ref_code: `ST${pi + 1}.${ti + 1}.${si + 1}`,
      })),
    })),
  }));
}

/**
 * Build a map of IDs to ref codes for change detection.
 */
export function buildRefCodeMap(pillars: NestedPillar[]): Record<string, string> {
  const map: Record<string, string> = {};
  pillars.forEach((p) => {
    map[p.id] = p.ref_code;
    p.themes.forEach((t) => {
      map[t.id] = t.ref_code;
      t.subthemes.forEach((s) => {
        map[s.id] = s.ref_code;
      });
    });
  });
  return map;
}
