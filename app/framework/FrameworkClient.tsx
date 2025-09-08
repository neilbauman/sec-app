'use client';

import * as React from 'react';

type Pillar = { code: string; name: string; description?: string; sort_order?: number };
type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order?: number };
type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order?: number };

type Props = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
      {children}
    </span>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-90' : 'rotate-0'}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M6.293 17.293a1 1 0 0 0 1.414 0l6-6a1 1 0 0 0 0-1.414l-6-6A1 1 0 0 0 6.293 5.293L11.586 10l-5.293 5.293a1 1 0 0 0 0 1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function FrameworkClient({ pillars, themes, subthemes }: Props) {
  // which pillar/theme rows are expanded
  const [openPillars, setOpenPillars] = React.useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = React.useState<Record<string, boolean>>({});

  // group themes by pillar + subthemes by theme
  const themesByPillar = React.useMemo(() => {
    const m = new Map<string, Theme[]>();
    for (const t of themes) {
      const key = t.pillar_code;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(t);
    }
    for (const arr of m.values()) arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return m;
  }, [themes]);

  const subsByTheme = React.useMemo(() => {
    const m = new Map<string, Subtheme[]>();
    for (const s of subthemes) {
      const key = s.theme_code;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(s);
    }
    for (const arr of m.values()) arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return m;
  }, [subthemes]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header row */}
      <div className="mb-4 flex items-center gap-3">
        <a href="/" className="text-sm text-gray-500 hover:text-gray-700">&larr; Dashboard</a>
        <h1 className="text-2xl font-semibold tracking-tight">Primary Framework Editor</h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => { setOpenPillars({}); setOpenThemes({}); }}
            className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Collapse all
          </button>
          <button
            onClick={() => {
              const p: Record<string, boolean> = {};
              const t: Record<string, boolean> = {};
              pillars.forEach(pl => (p[pl.code] = true));
              themes.forEach(th => (t[th.code] = true));
              setOpenPillars(p); setOpenThemes(t);
            }}
            className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Expand all
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Table header */}
        <div className="grid grid-cols-[auto_1fr_2fr_auto] items-center gap-4 border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <div>Type / Code</div>
          <div>Name</div>
          <div>Description</div>
          <div className="text-right pr-1">Sort</div>
        </div>

        {/* Pillar rows */}
        {pillars
          .slice()
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((p) => {
            const tList = themesByPillar.get(p.code) ?? [];
            const pOpen = !!openPillars[p.code];

            return (
              <div key={p.code} className="border-b border-gray-100">
                <div className="grid grid-cols-[auto_1fr_2fr_auto] items-center gap-4 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOpenPillars(s => ({ ...s, [p.code]: !s[p.code] }))}
                      aria-label={pOpen ? 'Collapse pillar' : 'Expand pillar'}
                      className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-50"
                    >
                      <IconChevron open={pOpen} />
                    </button>
                    <Badge>Pillar</Badge>
                    <span className="text-xs text-gray-400">[{p.code}]</span>
                  </div>

                  <div className="text-sm font-medium text-gray-900">{p.name}</div>
                  <div className="text-sm text-gray-700">{p.description}</div>
                  <div className="text-right text-sm tabular-nums text-gray-600 pr-1">{p.sort_order ?? ''}</div>
                </div>

                {/* Themes under pillar */}
                {pOpen && tList.map((t) => {
                  const sList = subsByTheme.get(t.code) ?? [];
                  const tOpen = !!openThemes[t.code];

                  return (
                    <div key={t.code} className="grid grid-cols-[auto_1fr_2fr_auto] items-start gap-4 px-4 py-2 pl-9">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setOpenThemes(s => ({ ...s, [t.code]: !s[t.code] }))}
                          aria-label={tOpen ? 'Collapse theme' : 'Expand theme'}
                          className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-50"
                        >
                          <IconChevron open={tOpen} />
                        </button>
                        <Badge>Theme</Badge>
                        <span className="text-xs text-gray-400">[{t.code}]</span>
                      </div>

                      <div className="text-sm font-medium text-gray-900">{t.name}</div>
                      <div className="text-sm text-gray-700">{t.description}</div>
                      <div className="text-right text-sm tabular-nums text-gray-600 pr-1">{t.sort_order ?? ''}</div>

                      {/* Subthemes */}
                      {tOpen && sList.length > 0 && (
                        <div className="col-span-4 pl-10 pb-3">
                          <div className="divide-y divide-gray-100 overflow-hidden rounded-md border border-gray-200">
                            {sList.map((s) => (
                              <div key={s.code} className="grid grid-cols-[auto_1fr_2fr_auto] items-center gap-4 bg-gray-50 px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <Badge>Subtheme</Badge>
                                  <span className="text-[11px] text-gray-400">[{s.code}]</span>
                                </div>
                                <div className="text-sm text-gray-900">{s.name}</div>
                                <div className="text-sm text-gray-700">{s.description}</div>
                                <div className="text-right text-sm text-gray-600 pr-1">{s.sort_order ?? ''}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
}
