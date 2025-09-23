// lib/framework-utils.ts
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

/**
 * Deep clone the framework tree so we don’t mutate state directly.
 */
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars)) as NestedPillar[];
}

/**
 * Renumber sort_order consistently across all levels.
 */
export function renumberAll(pillars: NestedPillar[]): NestedPillar[] {
  return pillars.map((p, i) => ({
    ...p,
    sort_order: i + 1,
    themes: p.themes.map((t, j) => ({
      ...t,
      sort_order: j + 1,
      subthemes: t.subthemes.map((s, k) => ({
        ...s,
        sort_order: k + 1,
      })),
    })),
  }));
}

/**
 * Build ref code map for display (Pillar#, Theme#, Subtheme#).
 */
export function buildRefCodeMap(pillars: NestedPillar[]): Record<string, string> {
  const map: Record<string, string> = {};
  pillars.forEach((p, i) => {
    const pRef = `P${i + 1}`;
    map[p.id] = pRef;
    p.themes.forEach((t, j) => {
      const tRef = `${pRef}.${j + 1}`;
      map[t.id] = tRef;
      t.subthemes.forEach((s, k) => {
        map[s.id] = `${tRef}.${k + 1}`;
      });
    });
  });
  return map;
}

// ---------- Local add/remove/move helpers (client-side only) ----------

export function addPillarLocal(pillars: NestedPillar[]): NestedPillar[] {
  const newPillar: NestedPillar = {
    id: crypto.randomUUID(),
    name: "New Pillar",
    description: "",
    sort_order: pillars.length + 1,
    ref_code: "",
    themes: [],
  };
  return renumberAll([...pillars, newPillar]);
}

export function addThemeLocal(pillars: NestedPillar[], pillarId: string): NestedPillar[] {
  return renumberAll(
    pillars.map((p) =>
      p.id !== pillarId
        ? p
        : {
            ...p,
            themes: [
              ...p.themes,
              {
                id: crypto.randomUUID(),
                pillar_id: p.id,
                name: "New Theme",
                description: "",
                sort_order: p.themes.length + 1,
                ref_code: "",
                subthemes: [],
              },
            ],
          }
    )
  );
}

export function addSubthemeLocal(pillars: NestedPillar[], pillarId: string, themeId: string): NestedPillar[] {
  return renumberAll(
    pillars.map((p) =>
      p.id !== pillarId
        ? p
        : {
            ...p,
            themes: p.themes.map((t) =>
              t.id !== themeId
                ? t
                : {
                    ...t,
                    subthemes: [
                      ...t.subthemes,
                      {
                        id: crypto.randomUUID(),
                        theme_id: t.id,
                        name: "New Subtheme",
                        description: "",
                        sort_order: t.subthemes.length + 1,
                        ref_code: "",
                      },
                    ],
                  }
            ),
          }
    )
  );
}

export function removePillarLocal(pillars: NestedPillar[], pillarId: string): NestedPillar[] {
  return renumberAll(pillars.filter((p) => p.id !== pillarId));
}

export function removeThemeLocal(pillars: NestedPillar[], pillarId: string, themeId: string): NestedPillar[] {
  return renumberAll(
    pillars.map((p) =>
      p.id !== pillarId ? p : { ...p, themes: p.themes.filter((t) => t.id !== themeId) }
    )
  );
}

export function removeSubthemeLocal(pillars: NestedPillar[], pillarId: string, themeId: string, subId: string): NestedPillar[] {
  return renumberAll(
    pillars.map((p) =>
      p.id !== pillarId
        ? p
        : {
            ...p,
            themes: p.themes.map((t) =>
              t.id !== themeId ? t : { ...t, subthemes: t.subthemes.filter((s) => s.id !== subId) }
            ),
          }
    )
  );
}

export function movePillarLocal(pillars: NestedPillar[], pillarId: string, direction: "up" | "down"): NestedPillar[] {
  const idx = pillars.findIndex((p) => p.id === pillarId);
  if (idx === -1) return pillars;
  const newIdx = direction === "up" ? idx - 1 : idx + 1;
  if (newIdx < 0 || newIdx >= pillars.length) return pillars;
  const newArr = [...pillars];
  const [moved] = newArr.splice(idx, 1);
  newArr.splice(newIdx, 0, moved);
  return renumberAll(newArr);
}

export function moveThemeLocal(pillars: NestedPillar[], pillarId: string, themeId: string, direction: "up" | "down"): NestedPillar[] {
  return renumberAll(
    pillars.map((p) => {
      if (p.id !== pillarId) return p;
      const idx = p.themes.findIndex((t) => t.id === themeId);
      if (idx === -1) return p;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= p.themes.length) return p;
      const newThemes = [...p.themes];
      const [moved] = newThemes.splice(idx, 1);
      newThemes.splice(newIdx, 0, moved);
      return { ...p, themes: newThemes };
    })
  );
}

export function moveSubthemeLocal(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string,
  direction: "up" | "down"
): NestedPillar[] {
  return renumberAll(
    pillars.map((p) => {
      if (p.id !== pillarId) return p;
      return {
        ...p,
        themes: p.themes.map((t) => {
          if (t.id !== themeId) return t;
          const idx = t.subthemes.findIndex((s) => s.id === subId);
          if (idx === -1) return t;
          const newIdx = direction === "up" ? idx - 1 : idx + 1;
          if (newIdx < 0 || newIdx >= t.subthemes.length) return t;
          const newSubs = [...t.subthemes];
          const [moved] = newSubs.splice(idx, 1);
          newSubs.splice(newIdx, 0, moved);
          return { ...t, subthemes: newSubs };
        }),
      };
    })
  );
}
