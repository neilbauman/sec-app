// lib/refCodes.ts
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";

/**
 * Recalculate hierarchical reference codes for all pillars, themes, and subthemes.
 * Format:
 *   Pillar → P1, P2, ...
 *   Theme → T{pillarIndex}.{themeIndex}  (e.g., T2.3)
 *   Subtheme → ST{pillarIndex}.{themeIndex}.{subIndex}  (e.g., ST1.2.1)
 */
export function recalcRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((pillar, pIdx) => {
    const pillarRef = `P${pIdx + 1}`;

    const themes: NestedTheme[] = pillar.themes.map((theme, tIdx) => {
      const themeRef = `T${pIdx + 1}.${tIdx + 1}`;

      const subthemes: NestedSubtheme[] = theme.subthemes.map((sub, sIdx) => {
        const subRef = `ST${pIdx + 1}.${tIdx + 1}.${sIdx + 1}`;
        return { ...sub, ref_code: subRef };
      });

      return { ...theme, ref_code: themeRef, subthemes };
    });

    return { ...pillar, ref_code: pillarRef, themes };
  });
}
