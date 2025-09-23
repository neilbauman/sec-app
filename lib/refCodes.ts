// lib/refCodes.ts
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

/**
 * Generate hierarchical reference codes for all pillars, themes, and subthemes.
 * Example:
 *   P1
 *   └─ T1.1
 *      └─ S1.1.1
 */
export function generateRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((pillar, pIndex) => {
    const pillarCode = `P${pIndex + 1}`;
    const themes = pillar.themes.map((theme, tIndex) => {
      const themeCode = `T${pIndex + 1}.${tIndex + 1}`;
      const subthemes = theme.subthemes.map((sub, sIndex) => {
        const subCode = `S${pIndex + 1}.${tIndex + 1}.${sIndex + 1}`;
        return {
          ...sub,
          ref_code: subCode,
          sort_order: sIndex + 1,
        } as NestedSubtheme;
      });
      return {
        ...theme,
        ref_code: themeCode,
        sort_order: tIndex + 1,
        subthemes,
      } as NestedTheme;
    });
    return {
      ...pillar,
      ref_code: pillarCode,
      sort_order: pIndex + 1,
      themes,
    } as NestedPillar;
  });
}

/**
 * Wrapper for recalculating ref codes across the full tree.
 */
export function recalcRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return generateRefCodes(pillars);
}
