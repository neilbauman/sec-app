'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, FolderTree } from 'lucide-react';

/**
 * Local structural types so we don't depend on external imports.
 * As long as the API objects have these fields, TS will be happy.
 */
type Pillar = {
  code: string;
  name: string;
  description?: string | null;
};

type Theme = {
  code: string;
  name: string;
  pillar_code: string; // associates to Pillar.code
  description?: string | null;
};

type Subtheme = {
  code: string;
  name: string;
  theme_code: string; // associates to Theme.code
  description?: string | null;
};

type Props = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

export default function PrimaryFrameworkCards({ pillars, themes, subthemes }: Props) {
  // track expanded/collapsed state
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // index themes by pillar, subthemes by theme
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

  const togglePillar = (code: string) =>
    setOpenPillars(prev => ({ ...prev, [code]: !prev[code] }));

  const toggleTheme = (code: string) =>
    setOpenThemes(prev => ({ ...prev, [code]: !prev[code] }));

  return (
    <section className="space-y-4">
      {pillars.map((p) => {
        const isPillarOpen = openPillars[p.code] ?? true;
        const pThemes = themesByPillar[p.code] ?? [];

        return (
          <div key={p.code} className="rounded-xl border bg-white shadow-sm">
            <button
              type="button"
              onClick={() => togglePillar(p.code)}
              className="flex w-full items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-2 text-left">
                {isPillarOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <span className="font-semibold">{p.name}</span>
              </div>
              <div className="text-xs text-slate-500">
                {pThemes.length} theme{pThemes.length === 1 ? '' : 's'}
              </div>
            </button>

            {isPillarOpen && (
              <div className="divide-y">
                {pThemes.map((t) => {
                  const isThemeOpen = openThemes[t.code] ?? true;
                  const tSubs = subthemesByTheme[t.code] ?? [];
                  return (
                    <div key={t.code} className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleTheme(t.code)}
                        className="flex w-full items-center justify-between"
                      >
                        <div className="flex items-center gap-2 text-left">
                          {isThemeOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          <span className="font-medium">{t.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {tSubs.length} subtheme{tSubs.length === 1 ? '' : 's'}
                        </div>
                      </button>

                      {isThemeOpen && (
                        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                          {tSubs.map((s) => (
                            <li
                              key={s.code}
                              className="flex items-start gap-2 rounded-lg border p-2 text-sm"
                            >
                              <FolderTree className="mt-0.5" size={14} />
                              <div>
                                <div className="font-medium">{s.name}</div>
                                {s.description ? (
                                  <div className="text-xs text-slate-500">{s.description}</div>
                                ) : null}
                              </div>
                            </li>
                          ))}
                          {tSubs.length === 0 && (
                            <li className="text-xs italic text-slate-500">No subthemes.</li>
                          )}
                        </ul>
                      )}
                    </div>
                  );
                })}
                {pThemes.length === 0 && (
                  <div className="px-4 py-3 text-sm italic text-slate-500">No themes.</div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {pillars.length === 0 && (
        <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
          No pillars found.
        </div>
      )}
    </section>
  );
}
