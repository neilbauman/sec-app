import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { v4 as uuidv4 } from "uuid";

export type RefMeta = {
  code: string;
  dirty: boolean;
};

// Clone framework deeply
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars));
}

// Recalculate all ref codes + sort_orders
export function recalcRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((pillar, pIdx) => {
    const pillarRef = `P${pIdx + 1}`;
    const themes = pillar.themes.map((theme, tIdx) => {
      const themeRef = `${pillarRef}.T${tIdx + 1}`;
      const subthemes = theme.subthemes.map((sub, sIdx) => ({
        ...sub,
        ref_code: `${themeRef}.${sIdx + 1}`,
        sort_order: sIdx + 1,
      }));
      return {
        ...theme,
        ref_code: themeRef,
        sort_order: tIdx + 1,
        subthemes,
      };
    });
    return {
      ...pillar,
      ref_code: pillarRef,
      sort_order: pIdx + 1,
      themes,
    };
  });
}

// Build a lookup for ref codes (with dirty flag)
export function buildRefCodeMap(pillars: NestedPillar[]): Record<string, RefMeta> {
  const map: Record<string, RefMeta> = {};
  pillars.forEach((pillar, pIdx) => {
    const pCode = `P${pIdx + 1}`;
    map[pillar.id] = { code: pCode, dirty: pillar.ref_code !== pCode };

    pillar.themes.forEach((theme, tIdx) => {
      const tCode = `${pCode}.T${tIdx + 1}`;
      map[theme.id] = { code: tCode, dirty: theme.ref_code !== tCode };

      theme.subthemes.forEach((sub, sIdx) => {
        const sCode = `${tCode}.${sIdx + 1}`;
        map[sub.id] = { code: sCode, dirty: sub.ref_code !== sCode };
      });
    });
  });
  return map;
}

// Factories
export function createPillar(): NestedPillar {
  return {
    id: uuidv4(),
    name: "Untitled Pillar",
    description: "",
    sort_order: 0,
    ref_code: "",
    themes: [],
  };
}

export function createTheme(pillarId: string): NestedTheme {
  return {
    id: uuidv4(),
    pillar_id: pillarId,
    name: "Untitled Theme",
    description: "",
    sort_order: 0,
    ref_code: "",
    subthemes: [],
  };
}

export function createSubtheme(themeId: string): NestedSubtheme {
  return {
    id: uuidv4(),
    theme_id: themeId,
    name: "Untitled Subtheme",
    description: "",
    sort_order: 0,
    ref_code: "",
  };
}
