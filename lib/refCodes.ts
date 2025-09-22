// lib/refCodes.ts
import { NestedPillar } from "@/lib/framework-client";

/**
 * Generate ref_codes for all pillars, themes, and subthemes.
 * Ref codes are recalculated sequentially (P1, P1-T1, P1-T1-S1, etc).
 */
export function generateRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((pillar, pIndex) => {
    const pillarRef = `P${pIndex + 1}`;
    return {
      ...pillar,
      ref_code: pillarRef,
      themes: pillar.themes.map((theme, tIndex) => {
        const themeRef = `${pillarRef}-T${tIndex + 1}`;
        return {
          ...theme,
          ref_code: themeRef,
          subthemes: theme.subthemes.map((sub, sIndex) => {
            return {
              ...sub,
              ref_code: `${themeRef}-S${sIndex + 1}`,
            };
          }),
        };
      }),
    };
  });
}
