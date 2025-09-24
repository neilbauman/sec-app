// lib/framework-utils.ts
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/types";

/**
 * Clone the full framework deeply (pillars -> themes -> subthemes).
 */
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars));
}

/**
 * Recalculate reference codes (P1, T1, S1, etc.) and sort order.
 */
export function recalcRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((pillar, pIdx) => {
    const pillarRef = `P${pIdx + 1}`;
    const themes = (pillar.children ?? []).map((theme: NestedTheme, tIdx) => {
      const themeRef = `${pillarRef}.T${tIdx + 1}`;
      const subthemes = (theme.children ?? []).map((sub: NestedSubtheme, sIdx) => ({
        ...sub,
        refCode: `${themeRef}.S${sIdx + 1}`,
        sortOrder: sIdx,
      }));
      return {
        ...theme,
        refCode: themeRef,
        sortOrder: tIdx,
        children: subthemes,
      };
    });

    return {
      ...pillar,
      refCode: pillarRef,
      sortOrder: pIdx,
      children: themes,
    };
  });
}
