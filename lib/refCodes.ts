import type { FrameworkTree } from '@/types/framework';

/**
 * Compute ref codes based on sort_order at each level.
 * P{p} for pillars, T{p}.{t} for themes, ST{p}.{t}.{s} for subthemes
 */
export function withRefCodes(tree: FrameworkTree): FrameworkTree {
  const pillars = (tree.pillars ?? []).map((pillar) => {
    const pillarCode = `P${pillar.sort_order}`;
    const themes = (pillar.themes ?? []).map((theme) => {
      const themeCode = `T${pillar.sort_order}.${theme.sort_order}`;
      const subthemes = (theme.subthemes ?? []).map((sub) => ({
        ...sub,
        ref_code: `ST${pillar.sort_order}.${theme.sort_order}.${sub.sort_order}`,
      }));
      return { ...theme, ref_code: themeCode, subthemes };
    });
    return { ...pillar, ref_code: pillarCode, themes };
  });
  return { pillars };
}
