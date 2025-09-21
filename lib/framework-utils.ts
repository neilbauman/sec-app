// lib/framework-utils.ts
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

// ---------- Normalized Types ----------
export type NormalizedSubtheme = {
  id: string;
  ref_code: string;
  theme_id: string;
  theme_code: string;
  name: string;
  description: string;
  sort_order: number;
};

export type NormalizedTheme = {
  id: string;
  ref_code: string;
  pillar_id: string;
  pillar_code: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: NormalizedSubtheme[];
};

export type NormalizedPillar = {
  id: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
  themes: NormalizedTheme[];
};

// ---------- Normalization ----------
export function normalizeFramework(nested: NestedPillar[]): NormalizedPillar[] {
  return nested.map((pillar, pIndex) => {
    const pillarCode = `P${pIndex + 1}`;

    const normalizedThemes: NormalizedTheme[] = pillar.themes.map(
      (theme, tIndex) => {
        const themeCode = `${pillarCode}.${tIndex + 1}`;

        const normalizedSubs: NormalizedSubtheme[] = theme.subthemes.map(
          (sub, sIndex) => ({
            ...sub,
            ref_code: `${themeCode}.${sIndex + 1}`,
            theme_code: themeCode,
          })
        );

        return {
          ...theme,
          ref_code: themeCode,
          pillar_code: pillarCode,
          subthemes: normalizedSubs,
        };
      }
    );

    return {
      ...pillar,
      ref_code: pillarCode,
      themes: normalizedThemes,
    };
  });
}
