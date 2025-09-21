// lib/framework-utils.ts
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

// ---------- Normalized Types ----------
export type NormalizedSubtheme = NestedSubtheme & {
  ref_code: string;
};

export type NormalizedTheme = NestedTheme & {
  ref_code: string;
  pillar_code: string;
  subthemes: NormalizedSubtheme[];
};

export type NormalizedPillar = NestedPillar & {
  ref_code: string;
  themes: NormalizedTheme[];
};

// ---------- Normalization Helper ----------
export function normalizeFramework(pillars: NestedPillar[]): NormalizedPillar[] {
  return pillars.map((pillar, pIndex) => {
    const pillarCode = `P${pillar.sort_order ?? pIndex + 1}`;

    const themes: NormalizedTheme[] = (pillar.themes || []).map((theme, tIndex) => {
      const themeCode = `${pillarCode}.${theme.sort_order ?? tIndex + 1}`;

      const subthemes: NormalizedSubtheme[] = (theme.subthemes || []).map(
        (sub, stIndex) => ({
          ...sub,
          ref_code: `${themeCode}.${sub.sort_order ?? stIndex + 1}`,
        })
      );

      return {
        ...theme,
        ref_code: themeCode,
        pillar_code: pillarCode,
        subthemes,
      };
    });

    return {
      ...pillar,
      ref_code: pillarCode,
      themes,
    };
  });
}
