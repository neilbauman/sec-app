import type { NestedPillar, NestedTheme, Subtheme } from "@/lib/framework-client";

export type NormalizedSubtheme = Subtheme & {
  ref_code: string;
  theme_code: string;
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

export function withRefCodes(data: { pillars: NestedPillar[] }) {
  let pillarCounter = 1;
  const pillars: NormalizedPillar[] = data.pillars.map((pillar) => {
    const pillarCode = `P${pillarCounter++}`;
    let themeCounter = 1;

    const themes: NormalizedTheme[] = pillar.themes.map((theme) => {
      const themeCode = `${pillarCode}.${themeCounter++}`;
      let subCounter = 1;

      const subthemes: NormalizedSubtheme[] = theme.subthemes.map((sub) => {
        const subCode = `${themeCode}.${subCounter++}`;
        return {
          ...sub,
          ref_code: subCode,
          theme_code: themeCode,
        };
      });

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

  return { pillars };
}
