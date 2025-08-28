// app/framework-browse/page.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';

type Pillar = { id: string; code: string; name: string; statement?: string|null; description?: string|null; sort_order: number|null; };
type Theme = { id: string; pillar_id: string; code: string; name: string; statement?: string|null; description?: string|null; sort_order: number|null; };
type Subtheme = { id: string; theme_id: string; code: string; name: string; statement?: string|null; description?: string|null; sort_order: number|null; };
type Standard = { id: string; subtheme_id: string; code: string; statement: string; notes?: string|null; sort_order: number|null; };
type Indicator = {
  id: string; code?: string|null; name: string; description?: string|null; weight?: number|null;
  pillar_id?: string|null; theme_id?: string|null; subtheme_id?: string|null; standard_id?: string|null;
  is_default: boolean; sort_order: number|null;
};

export default function BrowsePage() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subs, setSubs] = useState<Subtheme[]>([]);
  const [stds, setStds] = useState<Standard[]>([]);
  const [inds, setInds] = useState<Indicator[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true); setErr(null);
      const [pR, tR, sR, dR, iR] = await Promise.all([
        fetch('/api/pillars', { cache: 'no-store' }),
        fetch('/api/themes', { cache: 'no-store' }),
        fetch('/api/subthemes', { cache: 'no-store' }),
        fetch('/api/standards', { cache: 'no-store' }),
        fetch('/api/indicators', { cache: 'no-store' }),
      ]);
      const [p, t, s, d, i] = await Promise.all([pR.json(), tR.json(), sR.json(), dR.json(), iR.json()]);
      if (!pR.ok) setErr(p?.error || 'Failed to load pillars');
      if (!tR.ok) setErr(t?.error || 'Failed to load themes');
      if (!sR.ok) setErr(s?.error || 'Failed to load sub-themes');
      if (!dR.ok) setErr(d?.error || 'Failed to load standards');
      if (!iR.ok) setErr(i?.error || 'Failed to load indicators');
      if (pR.ok) setPillars(p); if (tR.ok) setThemes(t); if (sR.ok) setSubs(s); if (dR.ok) setStds(d); if (iR.ok) setInds(i);
      setLoading(false);
    })();
  }, []);

  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes) (m[t.pillar_id] ||= []).push(t);
    return m;
  }, [themes]);

  const subsByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const st of subs) (m[st.theme_id] ||= []).push(st);
    return m;
  }, [subs]);

  const stdsBySub = useMemo(() => {
    const m: Record<string, Standard[]> = {};
    for (const sd of stds) (m[sd.subtheme_id] ||= []).push(sd);
    return m;
  }, [stds]);

  const indByParent = useMemo(() => {
    const P = new Map<string, Indicator[]>(),
          T = new Map<string, Indicator[]>(),
          S = new Map<string, Indicator[]>(),
          D = new Map<string, Indicator[]>();
    for (const x of inds) {
      if (x.pillar_id) P.set(x.pillar_id, [...(P.get(x.pillar_id)||[]), x]);
      else if (x.theme_id) T.set(x.theme_id, [...(T.get(x.theme_id)||[]), x]);
      else if (x.subtheme_id) S.set(x.subtheme_id, [...(S.get(x.subtheme_id)||[]), x]);
      else if (x.standard_id) D.set(x.standard_id, [...(D.get(x.standard_id)||[]), x]);
    }
    return { P, T, S, D };
  }, [inds]);

  const qx = q.trim().toLowerCase();
  const match = (...vals: (string|undefined|null)[]) => !qx || vals.some(v => (v||'').toLowerCase().includes(qx));

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Browse SSC Framework</h1>
      <p style={{ opacity: 0.8 }}>Read-only explorer. Use the editor for changes.</p>

      <div style={{ display:'flex', gap:8, alignItems:'center', margin:'12px 0 16px' }}>
        <input
          placeholder="Search (code, name, statement, description, indicator)…"
          value={q}
          onChange={e=>setQ(e.target.value)}
          style={{ flex:1, padding:'10px 12px', border:'1px solid #ddd', borderRadius:8 }}
        />
        <a href="/api/export" style={{ whiteSpace:'nowrap' }}>Download CSV</a>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color:'crimson' }}>{err}</p>}

      <div style={{ display:'grid', gap:12 }}>
        {pillars
          .filter(p => match(p.code, p.name, p.statement, p.description))
          .sort(sortBy('sort_order','code'))
          .map(p => {
            const tForP = (themesByPillar[p.id]||[]).sort(sortBy('sort_order','code'))
              .filter(t => match(t.code, t.name, t.statement, t.description));
            const pDefaults = (indByParent.P.get(p.id)||[]).filter(x=>x.is_default);

            return (
              <details key={p.id} open>
                <summary><b>{p.code}</b> — {p.name}</summary>
                {p.statement && <div style={{ marginTop:6 }}><i>{p.statement}</i></div>}
                {p.description && <div style={{ marginTop:6 }}>{p.description}</div>}

                {pDefaults.length>0 && (
                  <div style={{ border:'1px solid #f1f1f1', borderRadius:8, padding:8, marginTop:8 }}>
                    <div style={{ fontWeight:600, marginBottom:4 }}>Pillar Default Indicator</div>
                    {pDefaults.map(ind => <IndRow key={ind.id} ind={ind} />)}
                  </div>
                )}

                <section style={{ margin:'8px 0 12px', paddingLeft:12, borderLeft:'2px solid #eee' }}>
                  <h3 style={{ margin:'8px 0' }}>Themes</h3>
                  <div style={{ display:'grid', gap:8, marginTop:8 }}>
                    {tForP.map(t => {
                      const sForT = (subsByTheme[t.id]||[]).sort(sortBy('sort_order','code'))
                        .filter(st => match(st.code, st.name, st.statement, st.description));
                      const tDefaults = (indByParent.T.get(t.id)||[]).filter(x=>x.is_default);

                      return (
                        <details key={t.id} style={{ marginLeft:8 }}>
                          <summary><b>{t.code}</b> — {t.name}</summary>
                          {t.statement && <div style={{ marginTop:6 }}><i>{t.statement}</i></div>}
                          {t.description && <div style={{ marginTop:6 }}>{t.description}</div>}
                          {tDefaults.length>0 && (
                            <div style={{ border:'1px solid #f1f1f1', borderRadius:8, padding:8, marginTop:8 }}>
                              <div style={{ fontWeight:600, marginBottom:4 }}>Theme Default Indicator</div>
                              {tDefaults.map(ind => <IndRow key={ind.id} ind={ind} />)}
                            </div>
                          )}

                          <section style={{ margin:'6px 0 10px', paddingLeft:12, borderLeft:'2px dashed #eee' }}>
                            <b>Sub-themes</b>
                            <div style={{ display:'grid', gap:6, marginTop:6 }}>
                              {sForT.map(st => {
                                const dForS = (stdsBySub[st.id]||[]).sort(sortBy('sort_order','code'))
                                  .filter(sd => match(sd.code, sd.statement, sd.notes||''));
                                const sDefaults = (indByParent.S.get(st.id)||[]).filter(x=>x.is_default);

                                return (
                                  <details key={st.id} style={{ marginLeft:8 }}>
                                    <summary><b>{st.code}</b> — {st.name}</summary>
                                    {st.statement && <div style={{ marginTop:6 }}><i>{st.statement}</i></div>}
                                    {st.description && <div style={{ marginTop:6 }}>{st.description}</div>}

                                    {sDefaults.length>0 && (
                                      <div style={{ border:'1px solid #f1f1f1', borderRadius:8, padding:8, marginTop:8 }}>
                                        <div style={{ fontWeight:600, marginBottom:4 }}>Sub-theme Default Indicator</div>
                                        {sDefaults.map(ind => <IndRow key={ind.id} ind={ind} />)}
                                      </div>
                                    )}

                                    <section style={{ margin:'6px 0 10px', paddingLeft:12, borderLeft:'2px dotted #eee' }}>
                                      <b>Standards</b>
                                      <div style={{ display:'grid', gap:6, marginTop:6 }}>
                                        {dForS.map(sd => {
                                          const stdInds = (indByParent.D.get(sd.id)||[]).sort(sortBy('sort_order','code'));
                                          return (
                                            <div key={sd.id} style={{ border:'1px solid #eee', borderRadius:8, padding:8 }}>
                                              <div style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
                                                <div><b>{sd.code}</b></div>
                                              </div>
                                              <div style={{ marginTop:6 }}>{sd.statement}</div>
                                              {sd.notes && <div style={{ marginTop:6, opacity:0.9 }}>{sd.notes}</div>}
                                              <div style={{ border:'1px solid #f7f7f7', borderRadius:8, padding:8, marginTop:8 }}>
                                                <b>Indicators</b>
                                                <div style={{ display:'grid', gap:6, marginTop:6 }}>
                                                  {stdInds.length>0
                                                    ? stdInds.map(ind => <IndRow key={ind.id} ind={ind} />)
                                                    : <div style={{ opacity:0.7 }}>No indicators listed.</div>}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                        {dForS.length === 0 && <div style={{ opacity:0.7 }}>No standards yet.</div>}
                                      </div>
                                    </section>
                                  </details>
                                );
                              })}
                              {(subsByTheme[t.id]||[]).length === 0 && <div style={{ opacity:0.7 }}>No sub-themes yet.</div>}
                            </div>
                          </section>
                        </details>
                      );
                    })}
                    {(themesByPillar[p.id]||[]).length === 0 && <div style={{ opacity:0.7 }}>No themes yet.</div>}
                  </div>
                </section>
              </details>
            );
          })}
        {!loading && pillars.length===0 && <p>No data yet.</p>}
      </div>
    </main>
  );
}

function IndRow({ ind }: { ind: Indicator }) {
  return (
    <div style={{ border:'1px solid #eee', borderRadius:6, padding:6 }}>
      <div><b>{ind.code || '—'}</b> {ind.name}{ind.is_default ? ' · default' : ''}</div>
      {ind.description && <div style={{ marginTop:4 }}>{ind.description}</div>}
      <div style={{ marginTop:4, fontSize:12, opacity:0.7 }}>Sort: {ind.sort_order ?? 1}</div>
    </div>
  );
}

function sortBy(a: string, b: string) {
  return (x: any, y: any) => {
    const ax = x?.[a] ?? 999999, ay = y?.[a] ?? 999999;
    if (ax !== ay) return ax - ay;
    const bx = String(x?.[b] ?? ''), by = String(y?.[b] ?? '');
    return bx.localeCompare(by, undefined, { numeric: true });
  };
}
