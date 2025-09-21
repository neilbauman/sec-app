// lib/refCodes.ts
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

/**
 * Recalculate hierarchical reference codes:
 *  - Pillars: P1, P2, ...
 *  - Themes: T{pillarIndex}.{themeIndex}  (e.g., T1.1, T2.3)
 *  - Subthemes: ST{pillarIndex}.{themeIndex}.{subIndex}  (e.g., ST1.2.1)
 */
export function recalcRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((pillar, pIndex) => {
    const pillarRef = `P${pIndex + 1}`;
    const themes: NestedTheme[] = pillar.themes.map((theme, tIndex) => {
      const themeRef = `T${pIndex + 1}.${tIndex + 1}`;
      const subthemes: NestedSubtheme[] = theme.subthemes.map((sub, sIndex) => {
        const subRef = `ST${pIndex + 1}.${tIndex + 1}.${sIndex + 1}`;
        return {
          ...sub,
          ref_code: subRef,
          sort_order: sIndex + 1,
        };
      });

      return {
        ...theme,
        ref_code: themeRef,
        sort_order: tIndex + 1,
        subthemes,
      };
    });

    return {
      ...pillar,
      ref_code: pillarRef,
      sort_order: pIndex + 1,
      themes,
    };
  });
}
