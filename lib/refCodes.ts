import type { FrameworkTree, Pillar, Theme, Subtheme } from '@/types/framework';

export function withRefCodes(tree: FrameworkTree): FrameworkTree {
  return {
    ...tree,
    pillars: tree.pillars.map((pillar, pIdx) => {
      const pillarCode = `P${pillar.sort_order ?? pIdx + 1}`;

      return {
        ...pillar,
        ref_code: pillarCode,
        themes: (pillar.themes ?? []).map((theme, tIdx) => {
          const themeCode = `${pillarCode}.${theme.sort_order ?? tIdx + 1}`;

          return {
            ...theme,
            ref_code: themeCode,
            subthemes: (theme.subthemes ?? []).map((sub, sIdx) => {
              const subCode = `${themeCode}.${sub.sort_order ?? sIdx + 1}`;

              return {
                ...sub,
                ref_code: subCode,
              } as Subtheme;
            }),
          } as Theme;
        }),
      } as Pillar;
    }),
  };
}
