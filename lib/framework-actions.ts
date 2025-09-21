// lib/framework-actions.ts
import {
  NormalizedPillar,
  NormalizedTheme,
  NormalizedSubtheme,
} from "@/lib/framework-utils";

// ---------- Add ----------
export function addPillar(pillars: NormalizedPillar[]): NormalizedPillar[] {
  const newPillar: NormalizedPillar = {
    id: crypto.randomUUID(),
    ref_code: `P${pillars.length + 1}`,
    name: "New Pillar",
    description: "",
    sort_order: pillars.length + 1,
    themes: [],
  };
  return [...pillars, newPillar];
}

export function addTheme(
  pillars: NormalizedPillar[],
  pillarId: string
): NormalizedPillar[] {
  return pillars.map((pillar) => {
    if (pillar.id === pillarId) {
      const newTheme: NormalizedTheme = {
        id: crypto.randomUUID(),
        ref_code: `${pillar.ref_code}.${pillar.themes.length + 1}`,
        pillar_id: pillarId,
        pillar_code: pillar.ref_code,
        name: "New Theme",
        description: "",
        sort_order: pillar.themes.length + 1,
        subthemes: [],
      };
      return { ...pillar, themes: [...pillar.themes, newTheme] };
    }
    return pillar;
  });
}

export function addSubtheme(
  pillars: NormalizedPillar[],
  pillarId: string,
  themeId: string
): NormalizedPillar[] {
  return pillars.map((pillar) => {
    if (pillar.id === pillarId) {
      const updatedThemes = pillar.themes.map((theme) => {
        if (theme.id === themeId) {
          const newSub: NormalizedSubtheme = {
            id: crypto.randomUUID(),
            ref_code: `${theme.ref_code}.${theme.subthemes.length + 1}`,
            theme_id: themeId,
            theme_code: theme.ref_code,
            name: "New Subtheme",
            description: "",
            sort_order: theme.subthemes.length + 1,
          };
          return { ...theme, subthemes: [...theme.subthemes, newSub] };
        }
        return theme;
      });
      return { ...pillar, themes: updatedThemes };
    }
    return pillar;
  });
}

// ---------- Remove ----------
export function removePillar(
  pillars: NormalizedPillar[],
  pillarId: string
): NormalizedPillar[] {
  return pillars.filter((p) => p.id !== pillarId);
}

export function removeTheme(
  pillars: NormalizedPillar[],
  pillarId: string,
  themeId: string
): NormalizedPillar[] {
  return pillars.map((pillar) => {
    if (pillar.id === pillarId) {
      return {
        ...pillar,
        themes: pillar.themes.filter((t) => t.id !== themeId),
      };
    }
    return pillar;
  });
}

export function removeSubtheme(
  pillars: NormalizedPillar[],
  pillarId: string,
  themeId: string,
  subthemeId: string
): NormalizedPillar[] {
  return pillars.map((pillar) => {
    if (pillar.id === pillarId) {
      const updatedThemes = pillar.themes.map((theme) => {
        if (theme.id === themeId) {
          return {
            ...theme,
            subthemes: theme.subthemes.filter((s) => s.id !== subthemeId),
          };
        }
        return theme;
      });
      return { ...pillar, themes: updatedThemes };
    }
    return pillar;
  });
}
