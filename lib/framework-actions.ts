// lib/framework-actions.ts
import {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";

// ---------- Add ----------
export function addPillar(pillars: NestedPillar[]): NestedPillar[] {
  const newPillar: NestedPillar = {
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
  pillars: NestedPillar[],
  pillarId: string
): NestedPillar[] {
  return pillars.map((pillar) => {
    if (pillar.id === pillarId) {
      const newTheme: NestedTheme = {
        id: crypto.randomUUID(),
        ref_code: `${pillar.ref_code}.${pillar.themes.length + 1}`,
        pillar_id: pillarId,
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
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): NestedPillar[] {
  return pillars.map((pillar) => {
    if (pillar.id === pillarId) {
      const updatedThemes = pillar.themes.map((theme) => {
        if (theme.id === themeId) {
          const newSub: NestedSubtheme = {
            id: crypto.randomUUID(),
            ref_code: `${theme.ref_code}.${theme.subthemes.length + 1}`,
            theme_id: themeId,
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
  pillars: NestedPillar[],
  pillarId: string
): NestedPillar[] {
  return pillars.filter((p) => p.id !== pillarId);
}

export function removeTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): NestedPillar[] {
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
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subthemeId: string
): NestedPillar[] {
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
