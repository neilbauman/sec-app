// lib/framework-utils.ts
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

// Ref metadata used for tracking pending changes
export type RefMeta = {
  code: string;
  dirty: boolean;
};

// Deep clone to avoid mutation issues
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars));
}

// Recalculate all ref codes from scratch
export function recalcRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  const copy = cloneFramework(pillars);

  copy.forEach((pillar, pIdx) => {
    pillar.ref_code = `P${pIdx + 1}`;
    pillar.sort_order = pIdx + 1;

    pillar.themes.forEach((theme, tIdx) => {
      theme.ref_code = `${pillar.ref_code}.T${tIdx + 1}`;
      theme.sort_order = tIdx + 1;

      theme.subthemes.forEach((sub, sIdx) => {
        sub.ref_code = `${theme.ref_code}.S${sIdx + 1}`;
        sub.sort_order = sIdx + 1;
      });
    });
  });

  return copy;
}

// Build a map of { id → { code, dirty } } to show pending changes
export function buildRefCodeMap(
  saved: NestedPillar[],
  current: NestedPillar[]
): Record<string, RefMeta> {
  const map: Record<string, RefMeta> = {};

  const walk = (
    savedItems: (NestedPillar | NestedTheme | NestedSubtheme)[],
    currentItems: (NestedPillar | NestedTheme | NestedSubtheme)[]
  ) => {
    currentItems.forEach((c, idx) => {
      const s = savedItems[idx];
      map[c.id] = {
        code: (c as any).ref_code,
        dirty: s ? (s as any).ref_code !== (c as any).ref_code : true,
      };

      if ("themes" in c) walk((s as NestedPillar)?.themes ?? [], c.themes);
      if ("subthemes" in c) walk((s as NestedTheme)?.subthemes ?? [], c.subthemes);
    });
  };

  walk(saved, current);
  return map;
}
