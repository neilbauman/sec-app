// lib/framework-utils.ts
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { generateRefCodes } from "@/lib/refCodes";

/**
 * Deep clone the framework tree so we don’t mutate state directly.
 */
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars)) as NestedPillar[];
}

/**
 * Recalculate all ref codes in the framework.
 */
export function recalcRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return generateRefCodes(pillars);
}

/**
 * Flatten the framework into a simple array of all nodes.
 */
export function flattenFramework(pillars: NestedPillar[]): Array<NestedPillar | NestedTheme | NestedSubtheme> {
  const result: Array<NestedPillar | NestedTheme | NestedSubtheme> = [];

  pillars.forEach((p) => {
    result.push(p);
    p.themes.forEach((t) => {
      result.push(t);
      t.subthemes.forEach((s) => {
        result.push(s);
      });
    });
  });

  return result;
}

/**
 * Find a pillar by ID.
 */
export function findPillar(pillars: NestedPillar[], pillarId: string): NestedPillar | undefined {
  return pillars.find((p) => p.id === pillarId);
}

/**
 * Find a theme by ID.
 */
export function findTheme(pillars: NestedPillar[], themeId: string): NestedTheme | undefined {
  for (const pillar of pillars) {
    const theme = pillar.themes.find((t) => t.id === themeId);
    if (theme) return theme;
  }
  return undefined;
}

/**
 * Find a subtheme by ID.
 */
export function findSubtheme(pillars: NestedPillar[], subthemeId: string): NestedSubtheme | undefined {
  for (const pillar of pillars) {
    for (const theme of pillar.themes) {
      const sub = theme.subthemes.find((s) => s.id === subthemeId);
      if (sub) return sub;
    }
  }
  return undefined;
}
