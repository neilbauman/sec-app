// lib/framework-utils.ts
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

/**
 * Deep clone the framework tree so we don’t mutate state directly.
 */
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars)) as NestedPillar[];
}

/**
 * Generate hierarchical ref codes (P#, T#.n, ST#.n.m).
 */
export function generateRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((pillar, pIndex) => {
    const pillarCode = `P${pIndex + 1}`;
    return {
      ...pillar,
      ref_code: pillarCode,
      themes: pillar.themes.map((theme, tIndex) => {
        const themeCode = `${pillarCode}.${tIndex + 1}`;
        return {
          ...theme,
          ref_code: themeCode,
          pillar_id: pillar.id,
          subthemes: theme.subthemes.map((sub, sIndex) => {
            const subCode = `${themeCode}.${sIndex + 1}`;
            return {
              ...sub,
              ref_code: subCode,
              theme_id: theme.id,
            };
          }),
        };
      }),
    };
  });
}

/**
 * Compare old vs new ref codes and mark which items changed.
 * Useful for UI to highlight pending changes before save.
 */
export function markChangedCodes(
  original: NestedPillar[],
  updated: NestedPillar[]
): NestedPillar[] {
  const mapCodes = (pillars: NestedPillar[]) => {
    const codes = new Map<string, string>();
    pillars.forEach((p) => {
      codes.set(p.id, p.ref_code);
      p.themes.forEach((t) => {
        codes.set(t.id, t.ref_code);
        t.subthemes.forEach((s) => codes.set(s.id, s.ref_code));
      });
    });
    return codes;
  };

  const originalCodes = mapCodes(original);

  const walk = (pillars: NestedPillar[]): NestedPillar[] =>
    pillars.map((p) => ({
      ...p,
      codeChanged: p.ref_code !== originalCodes.get(p.id),
      themes: p.themes.map((t) => ({
        ...t,
        codeChanged: t.ref_code !== originalCodes.get(t.id),
        subthemes: t.subthemes.map((s) => ({
          ...s,
          codeChanged: s.ref_code !== originalCodes.get(s.id),
        })),
      })),
    }));

  return walk(updated);
}

/**
 * Flatten the framework into a simple array of all nodes.
 */
export function flattenFramework(
  pillars: NestedPillar[]
): Array<NestedPillar | NestedTheme | NestedSubtheme> {
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
export function findPillar(
  pillars: NestedPillar[],
  pillarId: string
): NestedPillar | undefined {
  return pillars.find((p) => p.id === pillarId);
}

/**
 * Find a theme by ID.
 */
export function findTheme(
  pillars: NestedPillar[],
  themeId: string
): NestedTheme | undefined {
  for (const pillar of pillars) {
    const theme = pillar.themes.find((t) => t.id === themeId);
    if (theme) return theme;
  }
  return undefined;
}

/**
 * Find a subtheme by ID.
 */
export function findSubtheme(
  pillars: NestedPillar[],
  subthemeId: string
): NestedSubtheme | undefined {
  for (const pillar of pillars) {
    for (const theme of pillar.themes) {
      const sub = theme.subthemes.find((s) => s.id === subthemeId);
      if (sub) return sub;
    }
  }
  return undefined;
}
