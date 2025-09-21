// lib/refCodes.ts
import type { Pillar, Theme, Subtheme } from "@/lib/framework-client";

export type NormalizedPillar = {
  id: string;
  ref_code: string;       // e.g. P1, P2
  name: string;
  description: string;
  sort_order: number;
  themes: NormalizedTheme[];
};

export type NormalizedTheme = {
  id: string;
  ref_code: string;       // e.g. T1.1, T2.2
  pillar_id: string;
  pillar_code: string;    // parent pillar’s code (P1, P2)
  name: string;
  description: string;
  sort_order: number;
  subthemes: NormalizedSubtheme[];
};

export type NormalizedSubtheme = {
  id: string;
  ref_code: string;       // e.g. ST1.1.1
  theme_id: string;
  theme_code: string;     // parent theme’s code (T1.1)
  name: string;
  description: string;
  sort_order: number;
};

/**
 * Normalizes raw framework data into a consistent shape
 * with generated ref codes.
 */
export function normalizeFramework(raw: {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
}): { pillars: NormalizedPillar[] } {
  // Index themes by pillar
  const themesByPillar: Record<string, Theme[]> = {};
  raw.themes.forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push(t);
  });

  // Index subthemes by theme
  const subsByTheme: Record<string, Subtheme[]> = {};
  raw.subthemes.forEach((s) => {
    if (!subsByTheme[s.theme_id]) subsByTheme[s.theme_id] = [];
    subsByTheme[s.theme_id].push(s);
  });

  const normalizedPillars: NormalizedPillar[] = raw.pillars
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((pillar, pIdx) => {
      const pillarCode = `P${pIdx + 1}`;

      const themes: NormalizedTheme[] = (themesByPillar[pillar.id] || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((theme, tIdx) => {
          const themeCode = `${pillarCode}.${tIdx + 1}`;

          const subthemes: NormalizedSubtheme[] = (subsByTheme[theme.id] || [])
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((sub, sIdx) => ({
              id: sub.id,
              ref_code: `${themeCode}.${sIdx + 1}`,
              theme_id: theme.id,
              theme_code: themeCode,
              name: sub.name,
              description: sub.description,
              sort_order: sub.sort_order,
            }));

          return {
            id: theme.id,
            ref_code: themeCode,
            pillar_id: pillar.id,
            pillar_code: pillarCode,
            name: theme.name,
            description: theme.description,
            sort_order: theme.sort_order,
            subthemes,
          };
        });

      return {
        id: pillar.id,
        ref_code: pillarCode,
        name: pillar.name,
        description: pillar.description,
        sort_order: pillar.sort_order,
        themes,
      };
    });

  return { pillars: normalizedPillars };
}
