// app/framework/page.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';

/* ================= Types ================= */
type Pillar = {
  id: string; code: string; name: string;
  statement?: string | null; description?: string | null;
  sort_order: number | null;
};
type Theme = {
  id: string; pillar_id: string; code: string; name: string;
  statement?: string | null; description?: string | null;
  sort_order: number | null;
};
type Subtheme = {
  id: string; theme_id: string; code: string; name: string;
  statement?: string | null; description?: string | null;
  sort_order: number | null;
};
type Standard = {
  id: string; subtheme_id: string; code: string;
  statement: string; notes?: string | null;
  sort_order: number | null;
};
type Indicator = {
  id: string;
  code?: string | null;
  name: string;
  description?: string | null;
  weight?: number | null;
  pillar_id?: string | null;
  theme_id?: string | null;
  subtheme_id?: string | null;
  standard_id?: string | null;
  is_default: boolean;
  sort_order: number | null;
};

/* =============== Page =============== */
export default function FrameworkPage() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subs, setSubs] = useState<Subtheme[]>([]);
  const [stds, setStds] = useState<Standard[]>([]);
  const [inds, setInds] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    const [pR, tR, sR, dR, iR] = await Promise.all([
      fetch('/api/pillars', { cache: 'no-store' }),
      fetch('/api/themes', { cache: 'no-store' }),
      fetch('/api/subthemes', { cache: 'no-store' }),
      fetch('/api/standards', { cache: 'no-store' }),
      fetch('/api/indicators', { cache: 'no-store' }),
    ]);
    const [p, t, s, d, i] = await Promise.all([
      pR.json(), tR.json(), sR.json(), dR.json(), iR.json(),
    ]);
    if (!pR.ok) setErr(p?.error || 'Failed to load pillars');
    if (!tR.ok) setErr(t?.error || 'Failed to load themes');
    if (!sR.ok) setErr(s?.error || 'Failed to load sub-themes');
    if (!dR.ok) setErr(d?.error || 'Failed to load standards');
    if (!iR.ok) setErr(i?.error || 'Failed to load indicators');

    if (pR.ok) setPillars(p);
    if (tR.ok) setThemes(t);
    if (sR.ok) setSubs(s);
    if (dR.ok) setStds(d);
    if (iR.ok) setInds(i);
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

  const indByParent = useMemo(() => {
    const P = new Map<string, Indicator[]>(),
          T = new Map<string, Indicator[]>(),
          S = new Map<string, Indicator[]>(),
          D = new Map<string, Indicator[]>();
    for (const x of inds) {
      if (x.pillar_id) P.set(x.pillar_id, [...(P.get(x.pillar_id) || []), x]);
      else if (x.theme_id) T.set(x.theme_id, [...(T.get(x.theme_id) || []), x]);
      else if (x.subtheme_id) S.set(x.subtheme_id, [...(S.get(x.subtheme_id) || []), x]);
      else if (x.standard_id) D.set(x.standard_id, [...(D.get(x.standard_id) || []), x]);
    }
    return { P, T, S, D };
  }, [inds]);

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>SSC Framework — Pillars, Themes, Sub-themes & Standards</h1>
      <p style={{ opacity: 0.8 }}>
        Add items top-down. All changes save live.{' '}
        <a href="/api/export">Export CSV</a>
      </p>

      <AddPillar onDone={load} />

      {loading && <p>Loading…</p>}
      {err && <p style={{ color: 'crimson' }}>{err}</p>}

      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        {pillars.map((p) => (
          <details key={p.id} open>
            <summary>
              <b>{p.code}</b> — {p.name}
            </summary>

            <PillarCard p={p} onChanged={load} onDeleted={load} />

            {/* Pillar default indicator */}
            <IndicatorOneParent
              title="Pillar Default Indicator"
              parent={{ key: 'pillar_id', id: p.id, level: 'pillar' }}
              indicators={(indByParent.P.get(p.id) || []).filter((x) => x.is_default)}
              onDone={load}
            />

            {/* THEMES */}
            <section style={{ margin: '8px 0 12px', paddingLeft: 12, borderLeft: '2px solid #eee' }}>
              <h3 style={{ margin: '8px 0' }}>Themes</h3>
              <AddTheme pillar={p} onDone={load} />
              <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                {(themesByPillar[p.id] || []).map((t) => (
                  <details key={t.id} style={{ marginLeft: 8 }}>
                    <summary>
                      <b>{t.code}</b> — {t.name}
                    </summary>
                    <ThemeCard t={t} onChanged={load} onDeleted={load} />

                    {/* Theme default indicator */}
                    <IndicatorOneParent
                      title="Theme Default Indicator"
                      parent={{ key: 'theme_id', id: t.id, level: 'theme' }}
                      indicators={(indByParent.T.get(t.id) || []).filter((x) => x.is_default)}
                      onDone={load}
                    />

                    {/* SUB-THEMES */}
                    <section style={{ margin: '6px 0 10px', paddingLeft: 12, borderLeft: '2px dashed #eee' }}>
                      <b>Sub-themes</b>
                      <AddSubtheme theme={t} onDone={load} />
                      <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                        {(subsByTheme[t.id] || []).map((st) => (
                          <details key={st.id} style={{ marginLeft: 8 }}>
                            <summary>
                              <b>{st.code}</b> — {st.name}
                            </summary>
                            <SubthemeCard st={st} onChanged={load} onDeleted={load} />

                            {/* Sub-theme default indicator */}
                            <IndicatorOneParent
                              title="Sub-theme Default Indicator"
                              parent={{ key: 'subtheme_id', id: st.id, level: 'subtheme' }}
                              indicators={(indByParent.S.get(st.id) || []).filter((x) => x.is_default)}
                              onDone={load}
                            />

                            {/* STANDARDS */}
                            <section style={{ margin: '6px 0 10px', paddingLeft: 12, borderLeft: '2px dotted #eee' }}>
                              <b>Standards</b>
                              <AddStandard subtheme={st} onDone={load} />
                              <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                                {(stdsBySub[st.id] || []).map((sd) => (
                                  <div key={sd.id} style={{ marginLeft: 8 }}>
                                    <StandardCard sd={sd} onChanged={load} onDeleted={load} />
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

/* =============== Pillars =============== */
function AddPillar({ onDone }: { onDone: () => void }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [statement, setStatement] = useState('');
  const [description, setDescription] = useState('');
  const [sort, setSort] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const res = await fetch('/api/pillars', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.trim(), name: name.trim(),
        statement: statement.trim() || null,
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      })
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to save');
    else { setCode(''); setName(''); setStatement(''); setDescription(''); setSort(''); onDone(); }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2 style={{ margin: 0 }}>Add Pillar</h2>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
        <label>Code (e.g. P1)</label><input value={code} onChange={(e) => setCode(e.target.value)} required />
        <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Statement</label><input value={statement} onChange={(e) => setStatement(e.target.value)} placeholder="Narrative / standard" />
        <label>Description</label><input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
        <label>Sort Order</label><input type="number" value={sort} onChange={(e) => setSort(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add Pillar'}</button>
        {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
      </div>
    </form>
  );
}

function PillarCard({ p, onChanged, onDeleted }: { p: Pillar; onChanged: () => void; onDeleted: () => void }) {
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(p.code);
  const [name, setName] = useState(p.name);
  const [statement, setStatement] = useState(p.statement || '');
  const [description, setDescription] = useState(p.description || '');
  const [sort, setSort] = useState<number | ''>(p.sort_order ?? 1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/pillars/${p.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.trim(), name: name.trim(),
        statement: statement.trim() || null,
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      })
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to update');
    else { setEdit(false); onChanged(); }
  }

  async function del() {
    if (!confirm(`Delete pillar ${p.code}?`)) return;
    const res = await fetch(`/api/pillars/${p.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) alert(data?.error || 'Delete failed'); else onDeleted();
  }

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginTop: 8 }}>
      {!edit ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <b>{p.code}</b>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEdit(true)}>Edit</button>
              <button onClick={del}>Delete</button>
            </div>
          </div>
          <div style={{ opacity: 0.9 }}>{p.name}</div>
          {p.statement && <div style={{ marginTop: 6 }}><i>{p.statement}</i></div>}
          {p.description && <div style={{ marginTop: 6 }}>{p.description}</div>}
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>Sort: {p.sort_order ?? 1}</div>
        </>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
            <label>Code</label><input value={code} onChange={(e) => setCode(e.target.value)} required />
            <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required />
            <label>Statement</label><input value={statement} onChange={(e) => setStatement(e.target.value)} />
            <label>Description</label><input value={description} onChange={(e) => setDescription(e.target.value)} />
            <label>Sort</label><input type="number" value={sort} onChange={(e) => setSort(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setEdit(false)} disabled={saving}>Cancel</button>
            {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* =============== Themes =============== */
function AddTheme({ pillar, onDone }: { pillar: Pillar; onDone: () => void }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [statement, setStatement] = useState('');
  const [description, setDescription] = useState('');
  const [sort, setSort] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch('/api/themes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pillar_id: pillar.id,
        code: code.trim(), name: name.trim(),
        statement: statement.trim() || null,
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      })
    });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to save');
    else { setCode(''); setName(''); setStatement(''); setDescription(''); setSort(''); onDone(); }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, padding: 10, border: '1px dashed #ddd', borderRadius: 8, background: '#fafafa' }}>
      <b>Add Theme to {pillar.code}</b>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
        <label>Code (e.g. T1.1)</label><input value={code} onChange={(e) => setCode(e.target.value)} required />
        <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Statement</label><input value={statement} onChange={(e) => setStatement(e.target.value)} placeholder="Narrative / standard" />
        <label>Description</label><input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
        <label>Sort</label><input type="number" value={sort} onChange={(e) => setSort(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add Theme'}</button>
        {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
      </div>
    </form>
  );
}

function ThemeCard({ t, onChanged, onDeleted }: { t: Theme; onChanged: () => void; onDeleted: () => void }) {
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(t.code);
  const [name, setName] = useState(t.name);
  const [statement, setStatement] = useState(t.statement || '');
  const [description, setDescription] = useState(t.description || '');
  const [sort, setSort] = useState<number | ''>(t.sort_order ?? 1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/themes/${t.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.trim(), name: name.trim(),
        statement: statement.trim() || null,
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      })
    });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to update'); else { setEdit(false); onChanged(); }
  }

  async function del() {
    if (!confirm(`Delete theme ${t.code}?`)) return;
    const res = await fetch(`/api/themes/${t.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) alert(data?.error || 'Delete failed'); else onDeleted();
  }

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 10, marginTop: 6 }}>
      {!edit ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <b>{t.code}</b>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEdit(true)}>Edit</button>
              <button onClick={del}>Delete</button>
            </div>
          </div>
          <div style={{ opacity: 0.9 }}>{t.name}</div>
          {t.statement && <div style={{ marginTop: 6 }}><i>{t.statement}</i></div>}
          {t.description && <div style={{ marginTop: 6 }}>{t.description}</div>}
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>Sort: {t.sort_order ?? 1}</div>
        </>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
            <label>Code</label><input value={code} onChange={(e) => setCode(e.target.value)} required />
            <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required />
            <label>Statement</label><input value={statement} onChange={(e) => setStatement(e.target.value)} />
            <label>Description</label><input value={description} onChange={(e) => setDescription(e.target.value)} />
            <label>Sort</label><input type="number" value={sort} onChange={(e) => setSort(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setEdit(false)} disabled={saving}>Cancel</button>
            {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* =============== Sub-themes =============== */
function AddSubtheme({ theme, onDone }: { theme: Theme; onDone: () => void }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [statement, setStatement] = useState('');
  const [description, setDescription] = useState('');
  const [sort, setSort] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch('/api/subthemes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        theme_id: theme.id,
        code: code.trim(), name: name.trim(),
        statement: statement.trim() || null,
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      })
    });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to save');
    else { setCode(''); setName(''); setStatement(''); setDescription(''); setSort(''); onDone(); }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, padding: 10, border: '1px dashed #ddd', borderRadius: 8, background: '#fbfbfb', marginTop: 6 }}>
      <b>Add Sub-theme to {theme.code}</b>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
        <label>Code (e.g. ST1.1.1)</label><input value={code} onChange={(e) => setCode(e.target.value)} required />
        <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Statement</label><input value={statement} onChange={(e) => setStatement(e.target.value)} />
        <label>Description</label><input value={description} onChange={(e) => setDescription(e.target.value)} />
        <label>Sort</label><input type="number" value={sort} onChange={(e) => setSort(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add Sub-theme'}</button>
        {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
      </div>
    </form>
  );
}

function SubthemeCard({ st, onChanged, onDeleted }: { st: Subtheme; onChanged: () => void; onDeleted: () => void }) {
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(st.code);
  const [name, setName] = useState(st.name);
  const [statement, setStatement] = useState(st.statement || '');
  const [description, setDescription] = useState(st.description || '');
  const [sort, setSort] = useState<number | ''>(st.sort_order ?? 1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/subthemes/${st.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.trim(), name: name.trim(),
        statement: statement.trim() || null,
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      })
    });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to update'); else { setEdit(false); onChanged(); }
  }

  async function del() {
    if (!confirm(`Delete sub-theme ${st.code}?`)) return;
    const res = await fetch(`/api/subthemes/${st.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) alert(data?.error || 'Delete failed'); else onDeleted();
  }

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 10, marginTop: 6 }}>
      {!edit ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <b>{st.code}</b>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEdit(true)}>Edit</button>
              <button onClick={del}>Delete</button>
            </div>
          </div>
          <div style={{ opacity: 0.9 }}>{st.name}</div>
          {st.statement && <div style={{ marginTop: 6 }}><i>{st.statement}</i></div>}
          {st.description && <div style={{ marginTop: 6 }}>{st.description}</div>}
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>Sort: {st.sort_order ?? 1}</div>
        </>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
            <label>Code</label><input value={code} onChange={(e) => setCode(e.target.value)} required />
            <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required />
            <label>Statement</label><input value={statement} onChange={(e) => setStatement(e.target.value)} />
            <label>Description</label><input value={description} onChange={(e) => setDescription(e.target.value)} />
            <label>Sort</label><input type="number" value={sort} onChange={(e) => setSort(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setEdit(false)} disabled={saving}>Cancel</button>
            {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* =============== Standards =============== */
function AddStandard({ subtheme, onDone }: { subtheme: Subtheme; onDone: () => void }) {
  const [code, setCode] = useState('');
  const [statement, setStatement] = useState('');
  const [notes, setNotes] = useState('');
  const [sort, setSort] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch('/api/standards', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subtheme_id: subtheme.id,
        code: code.trim(), statement: statement.trim(),
        notes: notes.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      })
    });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to save');
    else { setCode(''); setStatement(''); setNotes(''); setSort(''); onDone(); }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, padding: 8, border: '1px dashed #ddd', borderRadius: 8, background: '#fff' }}>
      <b>Add Standard to {subtheme.code}</b>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
        <label>Code (e.g. STD1.1.1.1)</label><input value={code} onChange={(e) => setCode(e.target.value)} required />
        <label>Statement</label><input value={statement} onChange={(e) => setStatement(e.target.value)} required />
        <label>Notes</label><input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
        <label>Sort</label><input type="number" value={sort} onChange={(e) => setSort(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add Standard'}</button>
        {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
      </div>
    </form>
  );
}

function StandardCard({ sd, onChanged, onDeleted }: { sd: Standard; onChanged: () => void; onDeleted: () => void }) {
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(sd.code);
  const [statement, setStatement] = useState(sd.statement);
  const [notes, setNotes] = useState(sd.notes || '');
  const [sort, setSort] = useState<number | ''>(sd.sort_order ?? 1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/standards/${sd.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.trim(), statement: statement.trim(),
        notes: notes.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      })
    });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to update'); else { setEdit(false); onChanged(); }
  }

  async function del() {
    if (!confirm(`Delete standard ${sd.code}?`)) return;
    const res = await fetch(`/api/standards/${sd.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) alert(data?.error || 'Delete failed'); else onDeleted();
  }

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
      {!edit ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <b>{sd.code}</b>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEdit(true)}>Edit</button>
              <button onClick={del}>Delete</button>
            </div>
          </div>
          <div style={{ marginTop: 6 }}>{sd.statement}</div>
          {sd.notes && <div style={{ marginTop: 6, opacity: 0.9 }}>{sd.notes}</div>}
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>Sort: {sd.sort_order ?? 1}</div>
        </>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
            <label>Code</label><input value={code} onChange={(e) => setCode(e.target.value)} required />
            <label>Statement</label><input value={statement} onChange={(e) => setStatement(e.target.value)} required />
            <label>Notes</label><input value={notes} onChange={(e) => setNotes(e.target.value)} />
            <label>Sort</label><input type="number" value={sort} onChange={(e) => setSort(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setEdit(false)} disabled={saving}>Cancel</button>
            {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* =============== Indicators =============== */

// Ensure max one default indicator per Pillar/Theme/Sub-theme
function IndicatorOneParent({
  title,
  parent,
  indicators,
  onDone,
}: {
  title: string;
  parent: { key: 'pillar_id' | 'theme_id' | 'subtheme_id'; id: string; level: 'pillar' | 'theme' | 'subtheme' };
  indicators: Indicator[];
  onDone: () => void;
}) {
  const cur = indicators[0];
  const [code, setCode] = useState(cur?.code || '');
  const [name, setName] = useState(cur?.name || '');
  const [description, setDescription] = useState(cur?.description || '');
  const [sort, setSort] = useState<number | ''>(cur?.sort_order ?? 1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function saveNew(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch('/api/indicators', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [parent.key]: parent.id,
        code: code.trim() || null,
        name: name.trim() || `${title}`,
        description: description.trim() || null,
        is_default: true,
        sort_order: sort === '' ? 1 : Number(sort),
      }),
    });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to save'); else onDone();
  }

  async function update(id: string) {
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/indicators/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.trim() || null,
        name: name.trim(),
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
        is_default: true,
      }),
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
    <div style={{ border: '1px solid #f1f1f1', borderRadius: 8, padding: 8, marginTop: 8 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
      {!cur ? (
        <form onSubmit={saveNew} style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
          <label>Code</label><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="optional" />
          <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Default indicator name" />
          <label>Description</label><input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
          <label>Sort</label><input type="number" value={sort} onChange={(e) => setSort(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1" />
          <div />
          <div style={{ display: 'flex', gap: 8 }}>
            <button disabled={saving}>{saving ? 'Saving…' : 'Add default indicator'}</button>
            {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
          </div>
        </form>
      ) : (
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
          <label>Code</label><input value={code} onChange={(e) => setCode(e.target.value)} />
          <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} />
          <label>Description</label><input value={description} onChange={(e) => setDescription(e.target.value)} />
          <label>Sort</label><input type="number" value={sort} onChange={(e) => setSort(e.target.value === '' ? '' : Number(e.target.value))} />
          <div />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => update(cur.id)} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => del(cur.id)} disabled={saving}>Delete</button>
            {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function IndicatorList({
  parent,
  indicators,
  onDone,
}: {
  parent: { key: 'standard_id'; id: string; level: 'standard' };
  indicators: Indicator[];
  onDone: () => void;
}) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sort, setSort] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch('/api/indicators', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [parent.key]: parent.id,
        code: code.trim() || null,
        name: name.trim(),
        description: description.trim() || null,
        is_default: false,
        sort_order: sort === '' ? 1 : Number(sort),
      }),
    });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to save');
    else { setCode(''); setName(''); setDescription(''); setSort(''); onDone(); }
  }

  return (
    <div style={{ border: '1px solid #f4f4f4', borderRadius: 8, padding: 8, margin: '8px 0 12px' }}>
      <b>Indicators</b>
      <form onSubmit={add} style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr', marginTop: 6 }}>
        <label>Code</label><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. IND1.1.1.1" />
        <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Description</label><input value={description} onChange={(e) => setDescription(e.target.value)} />
        <label>Sort</label><input type="number" value={sort} onChange={(e) => setSort(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1" />
        <div />
        <div style={{ display: 'flex', gap: 8 }}>
          <button disabled={saving}>{saving ? 'Saving…' : 'Add Indicator'}</button>
          {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
        </div>
      </form>

      <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
        {indicators.map((ind) => <IndicatorItem key={ind.id} ind={ind} onDone={onDone} />)}
        {indicators.length === 0 && <div style={{ opacity: 0.7 }}>No indicators yet.</div>}
      </div>
    </div>
  );
}

function IndicatorItem({ ind, onDone }: { ind: Indicator; onDone: () => void }) {
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(ind.code || '');
  const [name, setName] = useState(ind.name);
  const [description, setDescription] = useState(ind.description || '');
  const [sort, setSort] = useState<number | ''>(ind.sort_order ?? 1);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/indicators/${ind.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.trim() || null,
        name: name.trim(),
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      })
    });
    setSaving(false);
    if (res.ok) { setEdit(false); onDone(); }
    else { const d = await res.json(); alert(d?.error || 'Update failed'); }
  }

  async function del() {
    if (!confirm('Delete indicator?')) return;
    const res = await fetch(`/api/indicators/${ind.id}`, { method: 'DELETE' });
    if (res.ok) onDone();
    else { const d = await res.json(); alert(d?.error || 'Delete failed'); }
  }

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 6, padding: 6 }}>
      {!edit ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div><b>{ind.code || '—'}</b> {ind.name}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setEdit(true)}>Edit</button>
              <button onClick={del}>Delete</button>
            </div>
          </div>
          {ind.description && <div style={{ marginTop: 4 }}>{ind.description}</div>}
          <div style={{ marginTop: 4, fontSize: 12, opacity: 0.7 }}>
            Sort: {ind.sort_order ?? 1}{ind.is_default ? ' · default' : ''}
          </div>
        </>
      ) : (
        <div style={{ display: 'grid', gap: 6, gridTemplateColumns: '1fr 2fr' }}>
          <label>Code</label><input value={code} onChange={(e) => setCode(e.target.value)} />
          <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Description</label><input value={description} onChange={(e) => setDescription(e.target.value)} />
          <label>Sort</label><input type="number" value={sort} onChange={(e) => setSort(e.target.value === '' ? '' : Number(e.target.value))} />
          <div />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setEdit(false)} disabled={saving}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
