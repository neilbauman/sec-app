// lib/framework-actions.ts
import {
  NormalizedPillar,
  NormalizedTheme,
  NormalizedSubtheme,
} from "@/lib/framework-utils";

// ----------------- Pillars -----------------
export function addPillar(pillars: NormalizedPillar[]): NormalizedPillar[] {
  const newPillar: NormalizedPillar = {
    id: crypto.randomUUID(),
    ref_code: `P${pillars.length + 1}`,
    name: "New Pillar",
    description: "Description here...",
    sort_order: pillars.length + 1,
    themes: [],
  };

  return [...pillars, newPillar];
}

// ----------------- Themes -----------------
export function addTheme(
  pillars: NormalizedPillar[],
  pillarId: string
): NormalizedPillar[] {
  return pillars.map((pillar) => {
    if (pillar.id !== pillarId) return pillar;

    const newTheme: NormalizedTheme = {
      id: crypto.randomUUID(),
      pillar_id: pillarId,
      pillar_code: pillar.ref_code,
      ref_code: `${pillar.ref_code}.${pillar.themes.length + 1}`,
      name: "New Theme",
      description: "Description here...",
      sort_order: pillar.themes.length + 1,
      subthemes: [],
    };

    return {
      ...pillar,
      themes: [...pillar.themes, newTheme],
    };
  });
}

// ----------------- Subthemes -----------------
export function addSubtheme(
  pillars: NormalizedPillar[],
  pillarId: string,
  themeId: string
): NormalizedPillar[] {
  return pillars.map((pillar) => {
    if (pillar.id !== pillarId) return pillar;

    return {
      ...pillar,
      themes: pillar.themes.map((theme) => {
        if (theme.id !== themeId) return theme;

        const newSubtheme: NormalizedSubtheme = {
          id: crypto.randomUUID(),
          theme_id: themeId,
          theme_code: theme.ref_code,
          ref_code: `${theme.ref_code}.${theme.subthemes.length + 1}`,
          name: "New Subtheme",
          description: "Description here...",
          sort_order: theme.subthemes.length + 1,
        };

        return {
          ...theme,
          subthemes: [...theme.subthemes, newSubtheme],
        };
      }),
    };
  });
}
