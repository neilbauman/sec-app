// app/framework/FrameworkClient.tsx
'use client';

import { useEffect, useState } from 'react';

type Pillar = { id: string; code?: string | null; name?: string | null; description?: string | null };
type Theme = { id: string; pillar_id: string; code?: string | null; name?: string | null; description?: string | null };
type Subtheme = { id: string; theme_id: string; code?: string | null; name?: string | null; description?: string | null };

type Payload = {
  ok: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  error?: string;
};

export default function FrameworkClient() {
  const [state, setState] = useState<{ loading: boolean; error?: string; data?: Payload }>({ loading: true });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/framework/api/list', { cache: 'no-store' });
        const json: Payload = await res.json();
        if (!cancelled) {
          if (!json.ok) setState({ loading: false, error: json.error || 'Unknown error' });
          else setState({ loading: false, data: json });
        }
      } catch (e: any) {
        if (!cancelled) setState({ loading: false, error: e?.message || 'Request failed' });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (state.loading) return <div className="text-sm text-gray-500">Loading framework…</div>;
  if (state.error)   return <div className="text-sm text-red-600">Error: {state.error}</div>;
  if (!state.data)   return null;

  const { pillars, themes, subthemes } = state.data;

  const themesByPillar = new Map<string, Theme[]>();
  themes.forEach(t => {
    const list = themesByPillar.get(t.pillar_id) || [];
    list.push(t);
    themesByPillar.set(t.pillar_id, list);
  });

  const subsByTheme = new Map<string, Subtheme[]>();
  subthemes.forEach(s => {
    const list = subsByTheme.get(s.theme_id) || [];
    list.push(s);
    subsByTheme.set(s.theme_id, list);
  });

  return (
    <div className="mt-6 space-y-4">
      {pillars.map(p => (
        <div key={p.id} className="rounded-lg border border-gray-200 p-4">
          <div className="font-semibold">
            {p.code ? `[${p.code}] ` : ''}{p.name || 'Untitled Pillar'}
          </div>
          {p.description && <div className="text-sm text-gray-600 mt-1">{p.description}</div>}

          <div className="mt-3 ml-3 space-y-3">
            {(themesByPillar.get(p.pillar_id as any) || themesByPillar.get(p.id) || []).map(t => (
              <div key={t.id} className="border-l-2 border-gray-200 pl-3">
                <div className="text-sm font-medium">
                  {t.code ? `[${t.code}] ` : ''}{t.name || 'Untitled Theme'}
                </div>
                {t.description && <div className="text-xs text-gray-600 mt-0.5">{t.description}</div>}

                <div className="mt-2 ml-3 space-y-2">
                  {(subsByTheme.get(t.id) || []).map(s => (
                    <div key={s.id} className="text-sm">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs mr-2">subtheme</span>
                      {s.code ? `[${s.code}] ` : ''}{s.name || 'Untitled Subtheme'}
                      {s.description && <span className="text-gray-600 ml-2">— {s.description}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {pillars.length === 0 && (
        <div className="text-sm text-gray-500">No pillars found.</div>
      )}
    </div>
  );
}
