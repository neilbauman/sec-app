// lib/refCodes.ts
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

/**
 * Recalculate hierarchical ref codes:
 * - P1, P2, ...
 * - T1.1, T1.2, ...
 * - ST1.1.1, ST1.1.2, ...
 */
export function recalcRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((pillar, pIdx) => {
    const pillarCode = `P${pIdx + 1}`;
    const newThemes: NestedTheme[] = pillar.themes.map((theme, tIdx) => {
      const themeCode = `T${pIdx + 1}.${tIdx + 1}`;
      const newSubs: NestedSubtheme[] = theme.subthemes.map((sub, sIdx) => ({
        ...sub,
        ref_code: `ST${pIdx + 1}.${tIdx + 1}.${sIdx + 1}`,
      }));
      return { ...theme, ref_code: themeCode, subthemes: newSubs };
    });
    return { ...pillar, ref_code: pillarCode, themes: newThemes };
  });
}
