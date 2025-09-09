// components/PrimaryFrameworkCards.tsx
'use client';

import React, { useMemo, useState } from 'react';

//
// Local types so this file is self-contained.
// If you already have shared types, you can delete these and import yours.
//
type Pillar = { code: string; name: string; description?: string | null };
type Theme = { code: string; name: string; pillar_code: string };
type Subtheme = { code: string; name: string; theme_code: string };

export type Props = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

export default function PrimaryFrameworkCards({ pillars, themes, subthemes }: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // Precompute groupings for quick renders
  const themesByPillar = useMemo(() => {
    const map: Record<string, Theme[]> = {};
    for (const t of themes) {
      if (!map[t.pillar_code]) map[t.pillar_code] = [];
      map[t.pillar_code].push(t);
    }
    return map;
  }, [themes]);

  const subthemesByTheme = useMemo(() => {
    const map: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      if (!map[s.theme_code]) map[s.theme_code] = [];
      map[s.theme_code].push(s);
    }
    return map;
  }, [subthemes]);

  return (
    <div className="space-y-4">
      {pillars.map((p) => {
        const isOpen = openPillars[p.code] ?? true;
        return (
          <div key={p.code} className="rounded-lg border">
            <button
              type="button"
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg flex items-center justify-between"
              onClick={() =>
                setOpenPillars((prev) => ({ ...prev, [p.code]: !(prev[p.code] ?? true) }))
              }
            >
              <span className="font-semibold">{p.name}</span>
              <span className="text-xs text-gray-500">{isOpen ? 'Collapse' : 'Expand'}</span>
            </button>

            {isOpen && (
              <div className="divide-y">
                {(themesByPillar[p.code] ?? []).map((t) => {
                  const tOpen = openThemes[t.code] ?? true;
                  return (
                    <div key={t.code} className="px-4 py-3">
                      <button
                        type="button"
                        className="w-full text-left flex items-center justify-between"
                        onClick={() =>
                          setOpenThemes((prev) => ({ ...prev, [t.code]: !(prev[t.code] ?? true) }))
                        }
                      >
                        <span className="font-medium">{t.name}</span>
                        <span className="text-xs text-gray-500">
                          {tOpen ? 'Hide subthemes' : 'Show subthemes'}
                        </span>
                      </button>

                      {tOpen && (
                        <ul className="mt-2 list-disc pl-6 space-y-1">
                          {(subthemesByTheme[t.code] ?? []).map((s) => (
                            <li key={s.code} className="text-sm">
                              {s.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
