import type { Pillar } from "@/types/framework";

export function generateRefCodes(pillars: Pillar[]) {
  return pillars.map((pillar, pIdx) => {
    const pillarCode = `P${pIdx + 1}`;
    return {
      ...pillar,
      ref_code: pillarCode,
      themes: pillar.themes.map((theme, tIdx) => {
        const themeCode = `${pillarCode}.${tIdx + 1}`;
        return {
          ...theme,
          ref_code: themeCode,
          subthemes: theme.subthemes.map((sub, sIdx) => ({
            ...sub,
            ref_code: `${themeCode}.${sIdx + 1}`,
          })),
        };
      }),
    };
  });
}
