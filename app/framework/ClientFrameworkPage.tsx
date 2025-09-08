// app/framework/ClientFrameworkPage.tsx
'use client';

import { useMemo, useState } from 'react';

type Pillar = { code: string; name: string; description?: string; sort_order?: number };
type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order?: number };
type SubTheme = { code: string; theme_code: string; name: string; description?: string; sort_order?: number };

export default function ClientFrameworkPage({
  pillars,
  themes,
  subthemes,
}: {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: SubTheme[];
}) {
  // Precompute lookups for quick, stable rendering
  const { themesByPillar, subsByTheme } = useMemo(() => {
    const tByPillar = new Map<string, Theme[]>();
    for (const t of themes) {
      const arr = tByPillar.get(t.pillar_code) ?? [];
      arr.push(t);
      tByPillar.set(t.pillar_code, arr);
    }
    for (const arr of tByPillar.values()) arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    const sByTheme = new Map<string, SubTheme[]>();
    for (const s of subthemes) {
      const arr = sByTheme.get(s.theme_code) ?? [];
      arr.push(s);
      sByTheme.set(s.theme_code, arr);
    }
    for (const arr of sByTheme.values()) arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    return { themesByPillar: tByPillar, subsByTheme: sByTheme };
  }, [themes, subthemes]);

  // Simple expand/collapse state
  const [openPillars, setOpenPillars] = useState<Set<string>>(new Set());
  const [openThemes, setOpenThemes] = useState<Set<string>>(new Set());

  const togglePillar = (code: string) =>
    setOpenPillars(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });

  const toggleTheme = (code: string) =>
    setOpenThemes(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });

  // Sort pillars by sort_order then code for a stable display
  const sortedPillars = useMemo(
    () => [...pillars].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.code.localeCompare(b.code)),
    [pillars]
  );

  return (
    <div className="space-y-4">
      {sortedPillars.map(p => {
        const tForP = themesByPillar.get(p.code) ?? [];
        const isOpen = openPillars.has(p.code);
        return (
          <div key={p.code} className="border rounded-lg">
            <button
              onClick={() => togglePillar(p.code)}
              className="w-full flex items-start justify-between p-3 text-left hover:bg-gray-50"
            >
              <div>
                <div className="text-sm font-semibold">
                  [{p.code}] {p.name || 'Untitled Pillar'}
                </div>
                {p.description ? <div className="text-xs text-gray-600 mt-1">{p.description}</div> : null}
              </div>
              <span className="text-sm text-gray-500">{isOpen ? '▾' : '▸'}</span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4">
                {tForP.length === 0 ? (
                  <div className="text-sm text-gray-500">No themes</div>
                ) : (
                  <div className="space-y-3">
                    {tForP.map(t => {
                      const sForT = subsByTheme.get(t.code) ?? [];
                      const tOpen = openThemes.has(t.code);
                      return (
                        <div key={t.code} className="border rounded-md">
                          <button
                            onClick={() => toggleTheme(t.code)}
                            className="w-full flex items-start justify-between p-2 pl-3 text-left bg-gray-50 hover:bg-gray-100 rounded-md"
                          >
                            <div>
                              <div className="text-sm font-medium">
                                [{t.code}] {t.name || 'Untitled Theme'}
                              </div>
                              {t.description ? (
                                <div className="text-xs text-gray-600 mt-1">{t.description}</div>
                              ) : null}
                            </div>
                            <span className="text-xs text-gray-500">{tOpen ? '▾' : '▸'}</span>
                          </button>

                          {tOpen && (
                            <div className="pl-4 pr-3 pb-3 pt-2">
                              {sForT.length === 0 ? (
                                <div className="text-sm text-gray-500">No sub-themes</div>
                              ) : (
                                <ul className="space-y-1">
                                  {sForT.map(s => (
                                    <li key={s.code} className="text-sm">
                                      <span className="font-mono text-xs mr-2">[{s.code}]</span>
                                      <span className="font-medium">{s.name || 'Untitled Sub-theme'}</span>
                                      {s.description ? (
                                        <span className="text-gray-600"> — {s.description}</span>
                                      ) : null}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
