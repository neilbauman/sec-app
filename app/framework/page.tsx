// app/framework/page.tsx
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

export default function FrameworkPage() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subs, setSubs] = useState<Subtheme[]>([]);
  const [stds, setStds] = useState<Standard[]>([]);
  const [inds, setInds] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);

  async function load() {
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
  }
  useEffect(() => { load(); }, []);

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

  // --- NEW: indicators grouped by parent
  const indByParent = useMemo(() => {
    const P = new Map<string, Indicator[]>(), T = new Map<string, Indicator[]>(),
          S = new Map<string, Indicator[]>(), D = new Map<string, Indicator[]>();
    for (const x of inds) {
      if (x.pillar_id) P.set(x.pillar_id, [...(P.get(x.pillar_id)||[]), x]);
      else if (x.theme_id) T.set(x.theme_id, [...(T.get(x.theme_id)||[]), x]);
      else if (x.subtheme_id) S.set(x.subtheme_id, [...(S.get(x.subtheme_id)||[]), x]);
      else if (x.standard_id) D.set(x.standard_id, [...(D.get(x.standard_id)||[]), x]);
    }
    return { P, T, S, D };
  }, [inds]);

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>SSC Framework — Pillars, Themes, Sub-themes & Standards</h1>
      <p style={{ opacity: 0.8 }}>Add items top-down. All changes save live. <a href="/api/export">Export CSV</a></p>

      <AddPillar onDone={load} />

      {loading && <p>Loading…</p>}
      {err && <p style={{ color: 'crimson' }}>{err}</p>}

      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        {pillars.map(p => (
          <details key={p.id} open>
            <summary><b>{p.code}</b> — {p.name}</summary>

            <PillarCard p={p} onChanged={load} onDeleted={load} />

            {/* --- NEW: Pillar default indicator --- */}
            <IndicatorOneParent
              title="Pillar Default Indicator"
              parent={{ key: 'pillar_id', id: p.id, level: 'pillar' }}
              indicators={(indByParent.P.get(p.id) || []).filter(x=>x.is_default)}
              onDone={load}
            />

            {/* THEMES */}
            <section style={{ margin: '8px 0 12px', paddingLeft: 12, borderLeft: '2px solid #eee' }}>
              <h3 style={{ margin: '8px 0' }}>Themes</h3>
              <AddTheme pillar={p} onDone={load} />
              <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                {(themesByPillar[p.id] || []).map(t => (
                  <details key={t.id} style={{ marginLeft: 8 }}>
                    <summary><b>{t.code}</b> — {t.name}</summary>
                    <ThemeCard t={t} onChanged={load} onDeleted={load} />

                    {/* --- NEW: Theme default indicator --- */}
                    <IndicatorOneParent
                      title="Theme Default Indicator"
                      parent={{ key: 'theme_id', id: t.id, level: 'theme' }}
                      indicators={(indByParent.T.get(t.id) || []).filter(x=>x.is_default)}
                      onDone={load}
                    />

                    {/* SUB-THEMES */}
                    <section style={{ margin: '6px 0 10px', paddingLeft: 12, borderLeft: '2px dashed #eee' }}>
                      <b>Sub-themes</b>
                      <AddSubtheme theme={t} onDone={load} />
                      <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                        {(subsByTheme[t.id] || []).map(st => (
                          <details key={st.id} style={{ marginLeft: 8 }}>
                            <summary><b>{st.code}</b> — {st.name}</summary>
                            <SubthemeCard st={st} onChanged={load} onDeleted={load} />

                            {/* --- NEW: Sub-theme default indicator --- */}
                            <IndicatorOneParent
                              title="Sub-theme Default Indicator"
                              parent={{ key: 'subtheme_id', id: st.id, level: 'subtheme' }}
                              indicators={(indByParent.S.get(st.id) || []).filter(x=>x.is_default)}
                              onDone={load}
                            />

                            {/* STANDARDS */}
                            <section style={{ margin: '6px 0 10px', paddingLeft: 12, borderLeft: '2px dotted #eee' }}>
                              <b>Standards</b>
                              <AddStandard subtheme={st} onDone={load} />
                              <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                                {(stdsBySub[st.id] || []).map(sd => (
                                  <div key={sd.id} style={{ marginLeft: 8 }}>
                                    <StandardCard sd={sd} onChanged={load} onDeleted={load} />
                                    {/* --- NEW: Standard indicators (list; not necessarily default) --- */}
                                    <IndicatorList
                                      parent={{ key: 'standard_id', id: sd.id, level: 'standard' }}
                                      indicators={indByParent.D.get(sd.id) || []}
                                      onDone={load}
                                    />
                                  </div>
                                ))}
                                {(stdsBySub[st.id] || []).length === 0 && (
                                  <div style={{ opacity: 0.7 }}>No standards yet for {st.code}.</div>
                                )}
                              </div>
                            </section>
                          </details>
                        ))}
                        {(subsByTheme[t.id] || []).length === 0 && (
                          <div style={{ opacity: 0.7 }}>No sub-themes yet for {t.code}.</div>
                        )}
                      </div>
                    </section>
                  </details>
                ))}
                {(themesByPillar[p.id] || []).length === 0 && (
                  <div style={{ opacity: 0.7 }}>No themes yet for {p.code}.</div>
                )}
              </div>
            </section>
          </details>
        ))}
        {!loading && pillars.length === 0 && <p>No pillars yet — add your first one above.</p>}
      </div>
    </main>
  );
}

/* ==== existing Add/Edit components for Pillar/Theme/Subtheme/Standard stay as you have them ==== */

/* ---------- Indicators (UI) ---------- */

// A compact block that ensures there is AT MOST ONE default indicator for a parent.
function IndicatorOneParent({ title, parent, indicators, onDone }:{
  title: string;
  parent: { key: 'pillar_id'|'theme_id'|'subtheme_id', id: string, level: 'pillar'|'theme'|'subtheme' };
  indicators: Indicator[];
  onDone: () => void;
}) {
  const cur = indicators[0]; // default-only
  const [code, setCode] = useState(cur?.code || '');
  const [name, setName] = useState(cur?.name || '');
  const [description, setDescription] = useState(cur?.description || '');
  const [sort, setSort] = useState<number|''>(cur?.sort_order ?? 1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);

  async function saveNew(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch('/api/indicators', {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        [parent.key]: parent.id,
        code: code.trim() || null,
        name: name.trim() || `${title}`,
        description: description.trim() || null,
        is_default: true,
        sort_order: sort === '' ? 1 : Number(sort),
      })
    });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to save'); else { onDone(); }
  }

  async function update(id: string) {
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/indicators/${id}`, {
      method: 'PUT', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        code: code.trim() || null,
        name: name.trim(),
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
        is_default: true
      })
    });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to update'); else onDone();
  }

  async function del(id: string) {
    if (!confirm('Delete indicator?')) return;
    const res = await fetch(`/api/indicators/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) alert(data?.error || 'Delete failed'); else onDone();
  }

  return (
    <div style={{ border:'1px solid #f1f1f1', borderRadius:8, padding:8, marginTop:8 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
      {!cur ? (
        <form onSubmit={saveNew} style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 2fr' }}>
          <label>Code</label><input value={code} onChange={e=>setCode(e.target.value)} placeholder="optional" />
          <label>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Default indicator name" />
          <label>Description</label><input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Optional" />
          <label>Sort</label><input type="number" value={sort} onChange={e=>setSort(e.target.value===''?'':Number(e.target.value))} placeholder="1" />
          <div />
          <div style={{ display:'flex', gap:8 }}><button disabled={saving}>{saving?'Saving…':'Add default indicator'}</button>{msg && <span style={{ color:'crimson' }}>{msg}</span>}</div>
        </form>
      ) : (
        <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 2fr' }}>
          <label>Code</label><input value={code} onChange={e=>setCode(e.target.value)} />
          <label>Name</label><input value={name} onChange={e=>setName(e.target.value)} />
          <label>Description</label><input value={description} onChange={e=>setDescription(e.target.value)} />
          <label>Sort</label><input type="number" value={sort} onChange={e=>setSort(e.target.value===''?'':Number(e.target.value))} />
          <div />
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={()=>update(cur.id)} disabled={saving}>{saving?'Saving…':'Save'}</button>
            <button onClick={()=>del(cur.id)} disabled={saving}>Delete</button>
            {msg && <span style={{ color:'crimson' }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// A full list for a standard (multiple indicators allowed)
function IndicatorList({ parent, indicators, onDone }:{
  parent: { key: 'standard_id', id: string, level: 'standard' };
  indicators: Indicator[];
  onDone: () => void;
}) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sort, setSort] = useState<number|''>('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch('/api/indicators', {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        [parent.key]: parent.id,
        code: code.trim() || null,
        name: name.trim(),
        description: description.trim() || null,
        is_default: false,
        sort_order: sort === '' ? 1 : Number(sort)
      })
    });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to save'); else { setCode(''); setName(''); setDescription(''); setSort(''); onDone(); }
  }

  return (
    <div style={{ border:'1px solid #f4f4f4', borderRadius:8, padding:8, margin:'8px 0 12px' }}>
      <b>Indicators</b>
      <form onSubmit={add} style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 2fr', marginTop:6 }}>
        <label>Code</label><input value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g. IND1.1.1.1" />
        <label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required />
        <label>Description</label><input value={description} onChange={e=>setDescription(e.target.value)} />
        <label>Sort</label><input type="number" value={sort} onChange={e=>setSort(e.target.value===''?'':Number(e.target.value))} placeholder="1" />
        <div />
        <div style={{ display:'flex', gap:8 }}><button disabled={saving}>{saving?'Saving…':'Add Indicator'}</button>{msg && <span style={{ color:'crimson' }}>{msg}</span>}</div>
      </form>

      <div style={{ display:'grid', gap:6, marginTop:8 }}>
        {indicators.map(ind => <IndicatorItem key={ind.id} ind={ind} onDone={onDone} />)}
        {indicators.length === 0 && <div style={{ opacity:0.7 }}>No indicators yet.</div>}
      </div>
    </div>
  );
}

function IndicatorItem({ ind, onDone }:{ ind: Indicator; onDone:()=>void }) {
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(ind.code || '');
  const [name, setName] = useState(ind.name);
  const [description, setDescription] = useState(ind.description || '');
  const [sort, setSort] = useState<number|''>(ind.sort_order ?? 1);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/indicators/${ind.id}`, {
      method: 'PUT', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ code: code.trim() || null, name: name.trim(), description: description.trim() || null, sort_order: sort===''?1:Number(sort) })
    });
    setSaving(false);
    if (res.ok) { setEdit(false); onDone(); } else { const d = await res.json(); alert(d?.error || 'Update failed'); }
  }

  async function del() {
    if (!confirm('Delete indicator?')) return;
    const res = await fetch(`/api/indicators/${ind.id}`, { method: 'DELETE' });
    if (res.ok) onDone(); else { const d = await res.json(); alert(d?.error || 'Delete failed'); }
  }

  return (
    <div style={{ border:'1px solid #eee', borderRadius:6, padding:6 }}>
      {!edit ? (
        <>
          <div style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
            <div><b>{ind.code || '—'}</b> {ind.name}</div>
            <div style={{ display:'flex', gap:6 }}><button onClick={()=>setEdit(true)}>Edit</button><button onClick={del}>Delete</button></div>
          </div>
          {ind.description && <div style={{ marginTop:4 }}>{ind.description}</div>}
          <div style={{ marginTop:4, fontSize:12, opacity:0.7 }}>Sort: {ind.sort_order ?? 1}{ind.is_default ? ' · default' : ''}</div>
        </>
      ) : (
        <div style={{ display:'grid', gap:6, gridTemplateColumns:'1fr 2fr' }}>
          <label>Code</label><input value={code} onChange={e=>setCode(e.target.value)} />
          <label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required />
          <label>Description</label><input value={description} onChange={e=>setDescription(e.target.value)} />
          <label>Sort</label><input type="number" value={sort} onChange={e=>setSort(e.target.value===''?'':Number(e.target.value))} />
          <div />
          <div style={{ display:'flex', gap:6 }}><button onClick={save} disabled={saving}>{saving?'Saving…':'Save'}</button><button onClick={()=>setEdit(false)} disabled={saving}>Cancel</button></div>
        </div>
      )}
    </div>
  );
}
