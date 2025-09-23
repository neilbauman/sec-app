// lib/framework-utils.ts
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

/**
 * Deep clone the framework tree so we don’t mutate state directly.
 */
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars)) as NestedPillar[];
}

/**
 * RefMeta describes a node’s ref code and whether it has been dirtied
 * by local reordering or editing since last save.
 */
export type RefMeta = {
  code: string;
  dirty: boolean;
};

/**
 * Build a map of id -> {code, dirty} for all nodes.
 */
export function buildRefCodeMap(
  pillars: NestedPillar[],
  previous?: Record<string, RefMeta>
): Record<string, RefMeta> {
  const map: Record<string, RefMeta> = {};
  pillars.forEach((pillar, i) => {
    const pillarCode = `P${i + 1}`;
    map[pillar.id] = {
      code: pillarCode,
      dirty: previous?.[pillar.id]?.code !== pillarCode,
    };
    pillar.themes.forEach((theme, j) => {
      const themeCode = `${pillarCode}.T${j + 1}`;
      map[theme.id] = {
        code: themeCode,
        dirty: previous?.[theme.id]?.code !== themeCode,
      };
      theme.subthemes.forEach((sub, k) => {
        const subCode = `${themeCode}.${k + 1}`;
        map[sub.id] = {
          code: subCode,
          dirty: previous?.[sub.id]?.code !== subCode,
        };
      });
    });
  });
  return map;
}

/**
 * Renumber all sort_order fields to be sequential (1-based).
 */
export function renumberAll(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((p, i) => ({
    ...p,
    sort_order: i + 1,
    themes: p.themes.map((t, j) => ({
      ...t,
      sort_order: j + 1,
      subthemes: t.subthemes.map((s, k) => ({
        ...s,
        sort_order: k + 1,
      })),
    })),
  }));
}
