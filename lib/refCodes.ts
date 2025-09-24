// lib/refCodes.ts
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/types";

/**
 * Assign reference codes (P#, T#, S#) to pillars, themes, subthemes.
 */
export function assignRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((pillar, pIndex) => {
    const pillarCode = `P${pIndex + 1}`;

    const themes = (pillar.children ?? []).map((theme: NestedTheme, tIndex) => {
      const themeCode = `${pillarCode}.T${tIndex + 1}`;

      const subthemes = (theme.children ?? []).map(
        (sub: NestedSubtheme, sIndex) => {
          const subCode = `${themeCode}.S${sIndex + 1}`;
          return {
            ...sub,
            refCode: subCode,
            sortOrder: sIndex,
          };
        }
      );

      return {
        ...theme,
        refCode: themeCode,
        sortOrder: tIndex,
        children: subthemes,
      };
    });

    return {
      ...pillar,
      refCode: pillarCode,
      sortOrder: pIndex,
      children: themes,
    };
  });
}
