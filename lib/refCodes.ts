// lib/refCodes.ts
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

/**
 * Generate ref codes for the entire framework (pillars → themes → subthemes).
 */
export function generateRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((pillar, pIdx) => {
    const refPillar: NestedPillar = {
      ...pillar,
      ref_code: `P${pIdx + 1}`,
      themes: pillar.themes.map((theme, tIdx) => {
        const refTheme: NestedTheme = {
          ...theme,
          ref_code: `T${pIdx + 1}.${tIdx + 1}`,
          subthemes: theme.subthemes.map((sub, sIdx) => {
            const refSub: NestedSubtheme = {
              ...sub,
              ref_code: `ST${pIdx + 1}.${tIdx + 1}.${sIdx + 1}`,
            };
            return refSub;
          }),
        };
        return refTheme;
      }),
    };
    return refPillar;
  });
}

/**
 * Generate a ref code string for a single item.
 */
export function generatePillarRef(pillarIndex: number): string {
  return `P${pillarIndex + 1}`;
}

export function generateThemeRef(pillarIndex: number, themeIndex: number): string {
  return `T${pillarIndex + 1}.${themeIndex + 1}`;
}

export function generateSubthemeRef(
  pillarIndex: number,
  themeIndex: number,
  subIndex: number
): string {
  return `ST${pillarIndex + 1}.${themeIndex + 1}.${subIndex + 1}`;
}
