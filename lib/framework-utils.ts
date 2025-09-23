// lib/framework-utils.ts
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { v4 as uuidv4 } from "uuid";

export type RefMeta = {
  code: string;
  dirty: boolean;
};

// ---------- Clone ----------
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars));
}

// ---------- Recalc Ref Codes ----------
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

// ---------- Build Ref Code Map ----------
export function buildRefCodeMap(pillars: NestedPillar[]): Record<string, RefMeta> {
  const map: Record<string, RefMeta> = {};
  pillars.forEach((pillar, pIdx) => {
    const pillarCode = `P${pIdx + 1}`;
    map[pillar.id] = { code: pillarCode, dirty: pillar.ref_code !== pillarCode };

    pillar.themes.forEach((theme, tIdx) => {
      const themeCode = `${pillarCode}.T${tIdx + 1}`;
      map[theme.id] = { code: themeCode, dirty: theme.ref_code !== themeCode };

      theme.subthemes.forEach((sub, sIdx) => {
        const subCode = `${themeCode}.${sIdx + 1}`;
        map[sub.id] = { code: subCode, dirty: sub.ref_code !== subCode };
      });
    });
  });
  return map;
}

// ---------- Factory Helpers ----------
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
