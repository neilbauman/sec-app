// app/framework/FrameworkClient.tsx
'use client';

import { useMemo } from 'react';

export type Pillar = {
  id: string;
  code: string | null;
  name: string | null;
  description: string | null;
};

export type Theme = {
  id: string;
  pillar_id: string;        // FK -> pillars.id
  code: string | null;
  name: string | null;
  description: string | null;
};

export type Subtheme = {
  id: string;
  theme_id: string;         // FK -> themes.id
  code: string | null;
  name: string | null;
  description: string | null;
};

type Props = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

export default function FrameworkClient({ pillars, themes, subthemes }: Props) {
  // Pre-index themes by pillar and subthemes by theme for cheap lookups.
  const { themesByPillar, subthemesByTheme } = useMemo(() => {
    const tByP = new Map<string, Theme[]>();
    for (const t of themes) {
      const arr = tByP.get(t.pillar_id) ?? [];
      arr.push(t);
      tByP.set(t.pillar_id, arr);
    }

    const stByT = new Map<string, Subtheme[]>();
    for (const s of subthemes) {
      const arr = stByT.get(s.theme_id) ?? [];
      arr.push(s);
      stByT.set(s.theme_id, arr);
    }

    // Optional: sort within groups by code then name for stable display
    for (const arr of tByP.values()) {
      arr.sort((a, b) =>
        (a.code ?? '').localeCompare(b.code ?? '') ||
        (a.name ?? '').localeCompare(b.name ?? '')
      );
    }
    for (const arr of stByT.values()) {
      arr.sort((a, b) =>
        (a.code ?? '').localeCompare(b.code ?? '') ||
        (a.name ?? '').localeCompare(b.name ?? '')
      );
    }

    return { themesByPillar: tByP, subthemesByTheme: stByT };
  }, [themes, subthemes]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold">Primary Framework Editor</h1>

      <div className="mt-6 space-y-4">
        {pillars.map((p) => (
          <div key={p.id} className="rounded-md border border-gray-200 p-3">
            <div className="text-lg font-medium">
              {p.code ? `[${p.code}] ` : ''}{p.name || 'Untitled Pillar'}
            </div>
            {p.description && (
              <div className="text-sm text-gray-600 mt-1">{p.description}</div>
            )}

            <div className="mt-3 ml-3 space-y-3">
              {(themesByPillar.get(p.id) || []).map((t) => (
                <div key={t.id} className="border-l-2 border-gray-200 pl-3">
                  <div className="text-sm font-medium">
                    {t.code ? `[${t.code}] ` : ''}{t.name || 'Untitled Theme'}
                  </div>
                  {t.description && (
                    <div className="text-sm text-gray-600 mt-1">{t.description}</div>
                  )}

                  <div className="mt-2 ml-3 space-y-2">
                    {(subthemesByTheme.get(t.id) || []).map((s) => (
                      <div key={s.id} className="border-l border-gray-200 pl-3">
                        <div className="text-sm">
                          {s.code ? `[${s.code}] ` : ''}{s.name || 'Untitled Subtheme'}
                        </div>
                        {s.description && (
                          <div className="text-xs text-gray-600 mt-1">{s.description}</div>
                        )}
                      </div>
                    ))}
                    {!(subthemesByTheme.get(t.id) || []).length && (
                      <div className="text-xs text-gray-400 italic">No subthemes</div>
                    )}
                  </div>
                </div>
              ))}
              {!(themesByPillar.get(p.id) || []).length && (
                <div className="text-sm text-gray-400 italic">No themes</div>
              )}
            </div>
          </div>
        ))}
        {!pillars.length && (
          <div className="text-gray-500 italic">No pillars found.</div>
        )}
      </div>
    </div>
  );
}
