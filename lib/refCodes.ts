// lib/refCodes.ts
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";

/**
 * Recalculate reference codes for the entire framework tree.
 * Format:
 *   Pillar → P1, P2, ...
 *   Theme → T{pillarIndex}.{themeIndex}
 *   Subtheme → ST{pillarIndex}.{themeIndex}.{subIndex}
 */
export function recalcRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((pillar, pIdx) => {
    const pillarRef = `P${pillar.sort_order}`;
    const themes = pillar.themes.map((theme, tIdx) => {
      const themeRef = `T${pillar.sort_order}.${theme.sort_order}`;
      const subthemes = theme.subthemes.map((sub, sIdx) => {
        const subRef = `ST${pillar.sort_order}.${theme.sort_order}.${sub.sort_order}`;
        return { ...sub, ref_code: subRef } as NestedSubtheme;
      });
      return { ...theme, ref_code: themeRef, subthemes } as NestedTheme;
    });
    return { ...pillar, ref_code: pillarRef, themes } as NestedPillar;
  });
}
