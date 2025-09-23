// lib/framework-utils.ts
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";

/**
 * Deep clone to avoid mutating props/state.
 */
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars)) as NestedPillar[];
}

/**
 * Return a stable UUID for new nodes.
 */
export function newId(): string {
  // In modern browsers this exists; fall back for SSR/build.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return crypto.randomUUID();
  }
  return `id_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/**
 * Ensure sort_order is 1..N at each level and arrays are ordered to match.
 * Returns a NEW array (non-mutating).
 */
export function renumberAll(pillars: NestedPillar[]): NestedPillar[] {
  const next = cloneFramework(pillars);

  // Sort/renumber pillars
  next.sort((a, b) => a.sort_order - b.sort_order);
  next.forEach((p, i) => {
    p.sort_order = i + 1;
    // themes
    p.themes.sort((a, b) => a.sort_order - b.sort_order);
    p.themes.forEach((t, j) => {
      t.sort_order = j + 1;
      // subthemes
      t.subthemes.sort((a, b) => a.sort_order - b.sort_order);
      t.subthemes.forEach((s, k) => {
        s.sort_order = k + 1;
      });
    });
  });

  return next;
}

/**
 * Build a map of id -> computed ref_code from the current order.
 * We compute codes purely from position (sort_order after renumber).
 */
export function buildRefCodeMap(
  pillars: NestedPillar[]
): Record<string, string> {
  const map: Record<string, string> = {};
  const ordered = renumberAll(pillars);

  ordered.forEach((p) => {
    const pCode = `P${p.sort_order}`;
    map[p.id] = pCode;

    p.themes.forEach((t) => {
      const tCode = `T${p.sort_order}.${t.sort_order}`;
      map[t.id] = tCode;

      t.subthemes.forEach((s) => {
        const sCode = `ST${p.sort_order}.${t.sort_order}.${s.sort_order}`;
        map[s.id] = sCode;
      });
    });
  });

  return map;
}

/**
 * Non-mutating helpers for local edits (no DB).
 */
export function addPillarLocal(pillars: NestedPillar[]): NestedPillar[] {
  const next = cloneFramework(pillars);
  const order = (next[next.length - 1]?.sort_order ?? 0) + 1;
  next.push({
    id: newId(),
    name: "Untitled Pillar",
    description: null,
    sort_order: order,
    themes: [],
  });
  return renumberAll(next);
}

export function addThemeLocal(
  pillars: NestedPillar[],
  pillarId: string
): NestedPillar[] {
  const next = cloneFramework(pillars);
  const p = next.find((x) => x.id === pillarId);
  if (!p) return next;
  const order = (p.themes[p.themes.length - 1]?.sort_order ?? 0) + 1;
  p.themes.push({
    id: newId(),
    pillar_id: pillarId,
    name: "New Theme",
    description: null,
    sort_order: order,
    subthemes: [],
  });
  return renumberAll(next);
}

export function addSubthemeLocal(
  pillars: NestedPillar[],
  themeId: string
): NestedPillar[] {
  const next = cloneFramework(pillars);
  for (const p of next) {
    const t = p.themes.find((x) => x.id === themeId);
    if (!t) continue;
    const order = (t.subthemes[t.subthemes.length - 1]?.sort_order ?? 0) + 1;
    t.subthemes.push({
      id: newId(),
      theme_id: themeId,
      name: "New Subtheme",
      description: null,
      sort_order: order,
    });
    break;
  }
  return renumberAll(next);
}

export function removePillarLocal(
  pillars: NestedPillar[],
  pillarId: string
): NestedPillar[] {
  const next = cloneFramework(pillars).filter((p) => p.id !== pillarId);
  return renumberAll(next);
}

export function removeThemeLocal(
  pillars: NestedPillar[],
  themeId: string
): NestedPillar[] {
  const next = cloneFramework(pillars);
  for (const p of next) {
    const before = p.themes.length;
    p.themes = p.themes.filter((t) => t.id !== themeId);
    if (p.themes.length !== before) break;
  }
  return renumberAll(next);
}

export function removeSubthemeLocal(
  pillars: NestedPillar[],
  subId: string
): NestedPillar[] {
  const next = cloneFramework(pillars);
  for (const p of next) {
    for (const t of p.themes) {
      const before = t.subthemes.length;
      t.subthemes = t.subthemes.filter((s) => s.id !== subId);
      if (t.subthemes.length !== before) return renumberAll(next);
    }
  }
  return renumberAll(next);
}

function move<T>(arr: T[], from: number, to: number): T[] {
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function movePillarLocal(
  pillars: NestedPillar[],
  pillarId: string,
  direction: "up" | "down"
): NestedPillar[] {
  const next = cloneFramework(pillars);
  const i = next.findIndex((p) => p.id === pillarId);
  if (i === -1) return next;
  const j = direction === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= next.length) return next;
  const moved = move(next, i, j);
  return renumberAll(moved);
}

export function moveThemeLocal(
  pillars: NestedPillar[],
  themeId: string,
  direction: "up" | "down"
): NestedPillar[] {
  const next = cloneFramework(pillars);
  for (const p of next) {
    const i = p.themes.findIndex((t) => t.id === themeId);
    if (i === -1) continue;
    const j = direction === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= p.themes.length) return next;
    p.themes = move(p.themes, i, j);
    return renumberAll(next);
  }
  return next;
}

export function moveSubthemeLocal(
  pillars: NestedPillar[],
  subId: string,
  direction: "up" | "down"
): NestedPillar[] {
  const next = cloneFramework(pillars);
  for (const p of next) {
    for (let ti = 0; ti < p.themes.length; ti++) {
      const t = p.themes[ti];
      const i = t.subthemes.findIndex((s) => s.id === subId);
      if (i === -1) continue;
      const j = direction === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= t.subthemes.length) return next;
      t.subthemes = move(t.subthemes, i, j);
      return renumberAll(next);
    }
  }
  return next;
}
