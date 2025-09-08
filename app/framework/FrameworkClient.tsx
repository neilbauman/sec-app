'use client';

import { useEffect, useState } from 'react';

type Pillar = { code: string; name: string; description?: string; sort_order?: number };
type Theme  = { code: string; pillar_code: string; name: string; description?: string; sort_order?: number };
type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order?: number };

type ApiPayload = {
  ok: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

export default function FrameworkClient() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subthemes, setSubthemes] = useState<Subtheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/framework/api/list', { cache: 'no-store' });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data: ApiPayload = await res.json();
        if (!mounted) return;
        setPillars((data.pillars || []).sort((a,b)=>(a.sort_order ?? 0)-(b.sort_order ?? 0)));
        setThemes((data.themes || []).sort((a,b)=>(a.sort_order ?? 0)-(b.sort_order ?? 0)));
        setSubthemes((data.subthemes || []).sort((a,b)=>(a.sort_order ?? 0)-(b.sort_order ?? 0)));
      } catch (e:any) {
        if (mounted) setErr(e?.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // lookup helpers (by *code*, matching your schema)
  const themesByPillar = new Map<string, Theme[]>();
  for (const p of pillars) {
    themesByPillar.set(
      p.code,
      themes.filter(t => t.pillar_code === p.code)
    );
  }
  const subthemesByTheme = new Map<string, Subtheme[]>();
  for (const t of themes) {
    subthemesByTheme.set(
      t.code,
      subthemes.filter(st => st.theme_code === t.code)
    );
  }

  return (
    <div className="fw-wrap">
      <h1 className="fw-title">Primary Framework Editor</h1>

      <div className="fw-stats">
        <div><div className="stat-label">Pillars</div><div className="stat-num">{pillars.length}</div></div>
        <div><div className="stat-label">Themes</div><div className="stat-num">{themes.length}</div></div>
        <div><div className="stat-label">Sub-themes</div><div className="stat-num">{subthemes.length}</div></div>
      </div>

      {loading && <div className="note">Loading…</div>}
      {err && <div className="error">Error: {err}</div>}

      {!loading && !err && (
        <div className="tree">
          {pillars.map(p => (
            <details key={p.code} className="node">
              <summary className="row">
                <span className="tag tag-pillar">{p.code}</span>
                <span className="name">{p.name || 'Untitled Pillar'}</span>
                {p.description ? <span className="desc">{p.description}</span> : null}
              </summary>

              <div className="children">
                {(themesByPillar.get(p.code) || []).map(t => (
                  <details key={t.code} className="node">
                    <summary className="row">
                      <span className="tag tag-theme">{t.code}</span>
                      <span className="name">{t.name || 'Untitled Theme'}</span>
                      {t.description ? <span className="desc">{t.description}</span> : null}
                    </summary>

                    <div className="children">
                      {(subthemesByTheme.get(t.code) || []).map(st => (
                        <div key={st.code} className="row leaf">
                          <span className="tag tag-subtheme">{st.code}</span>
                          <span className="name">{st.name || 'Untitled Sub-theme'}</span>
                          {st.description ? <span className="desc">{st.description}</span> : null}
                        </div>
                      ))}
                      {(subthemesByTheme.get(t.code) || []).length === 0 && (
                        <div className="row leaf muted">No sub-themes</div>
                      )}
                    </div>
                  </details>
                ))}
                {(themesByPillar.get(p.code) || []).length === 0 && (
                  <div className="row muted">No themes</div>
                )}
              </div>
            </details>
          ))}
        </div>
      )}

      <p className="footnote">
        Read-only scaffold. Data comes from <code>/framework/api/list</code>.  
        We’ll add actions (add/edit/delete, CSV, etc.) next.
      </p>
    </div>
  );
}
