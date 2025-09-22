// lib/framework-utils.ts
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";

/** Deep clone to avoid mutating state directly */
export function cloneFramework(pillars: NestedPillar[]): NestedPillar[] {
  return JSON.parse(JSON.stringify(pillars)) as NestedPillar[];
}

/**
 * Compute display ref codes based on current sort_order positions:
 * Pillar:   P{p}
 * Theme:    T{p}.{t}
 * Subtheme: ST{p}.{t}.{s}
 * (1-based indices)
 */
export function recalcRefCodes(pillars: NestedPillar[]): NestedPillar[] {
  const copy = cloneFramework(pillars);

  // Sort each level just in case
  copy.sort((a, b) => a.sort_order - b.sort_order);
  copy.forEach((p) => p.themes.sort((a, b) => a.sort_order - b.sort_order));
  copy.forEach((p) =>
    p.themes.forEach((t) => t.subthemes.sort((a, b) => a.sort_order - b.sort_order))
  );

  // Assign codes using 1-based positions
  copy.forEach((p, pi) => {
    p.ref_code = `P${pi + 1}`;
    p.themes.forEach((t, ti) => {
      t.ref_code = `T${pi + 1}.${ti + 1}`;
      t.subthemes.forEach((s, si) => {
        s.ref_code = `ST${pi + 1}.${ti + 1}.${si + 1}`;
      });
    });
  });

  return copy;
}

/** Utility used by delete operations to normalize contiguous sort orders per level */
export function normalizeSortOrders(pillars: NestedPillar[]): NestedPillar[] {
  const copy = cloneFramework(pillars);

  copy
    .sort((a, b) => a.sort_order - b.sort_order)
    .forEach((p, pi) => {
      p.sort_order = pi + 1;

      p.themes
        .sort((a, b) => a.sort_order - b.sort_order)
        .forEach((t, ti) => {
          t.sort_order = ti + 1;

          t.subthemes
            .sort((a, b) => a.sort_order - b.sort_order)
            .forEach((s, si) => {
              s.sort_order = si + 1;
            });
        });
    });

  return copy;
}
